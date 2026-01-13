import express from 'express';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { HealthProfileService } from '../../../../services/users/patient/health.profile.service';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { CohortService } from '../../../../services/community/cohort.service';
import { Injector } from '../../../../startup/injector';
import { PatientValidator } from './patient.validator';
import { BaseUserController } from '../../base.user.controller';
import { UserHelper } from '../../user.helper';
import { UserDeviceDetailsService } from '../../../../services/users/user/user.device.details.service';
import { PersonService } from '../../../../services/person/person.service';
import { UserService } from '../../../../services/users/user/user.service';
import { CustomActionsHandler } from '../../../../custom/custom.actions.handler';
import { HealthProfileDomainModel } from '../../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { RoleDto } from '../../../../domain.types/role/role.dto';
import { Roles } from '../../../../domain.types/role/role.types';
import { EHRPatientService } from '../../../../modules/ehr.analytics/ehr.services/ehr.patient.service';
import { MedicationService } from '../../../../services/clinical/medication/medication.service';
import { MedicationConsumptionService } from '../../../../services/clinical/medication/medication.consumption.service';
import { PatientSearchFilters } from '../../../../domain.types/users/patient/patient/patient.search.types';
import { UserEvents } from '../../user/user.events';
import { PatientDeleteService } from '../../../../services/users/patient/patient.delete.service';
import { UserDeleteEvent } from '../../../../domain.types/events/event.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientController extends BaseUserController {

    //#region member variables and constructors
    _service: PatientService = Injector.Container.resolve(PatientService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _userDeviceDetailsService: UserDeviceDetailsService = Injector.Container.resolve(UserDeviceDetailsService);

    _patientHealthProfileService: HealthProfileService = Injector.Container.resolve(HealthProfileService);

    _cohortService: CohortService = Injector.Container.resolve(CohortService);

    _medicationService: MedicationService = Injector.Container.resolve(MedicationService);

    _medicationConsumptionService: MedicationConsumptionService = Injector.Container.resolve(MedicationConsumptionService);

    _ehrPatientService: EHRPatientService = Injector.Container.resolve(EHRPatientService);

    _userHelper: UserHelper = new UserHelper();

    _customActionHandler: CustomActionsHandler = new CustomActionsHandler();

    _validator = new PatientValidator();

    _patientDeleteService: PatientDeleteService = Injector.Container.resolve(PatientDeleteService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            const [ patient, createdNew ] = await this._userHelper.createPatient(model);

            if (model.CohortId != null) {
                await this.addPatientToCohort(patient.UserId, model.CohortId);
            }

            const clientCode = request.currentClient.ClientCode;
            await this._customActionHandler.performActions_PostRegistration(patient, clientCode);

            await this._ehrPatientService.addEHRRecordPatientForAppNames(patient);

            if (createdNew) {
                UserEvents.onUserCreated(request, patient.User);
                ResponseHandler.success(request, response, 'Patient created successfully!', 201, {
                    Patient : patient,
                });
                return;
            }
            ResponseHandler.failure(request, response, `Patient account already exists!`, 409);
        } catch (error) {

            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, user.id, user.TenantId);

            const patient = await this._service.getByUserId(userId);

            const healthProfile = await this._patientHealthProfileService.getByPatientUserId(userId);
            patient.HealthProfile = healthProfile;

            Logger.instance().log(`Patient: ${JSON.stringify(patient)}`);

            if (patient == null) {
                throw new ApiError(404, 'Patient not found.');
            }

            ResponseHandler.success(request, response, 'Patient retrieved successfully!', 200, {
                Patient : patient,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters: PatientSearchFilters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} patient records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Patients : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //To be deprecated
    getPatientByPhone = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            if (request.currentClient.IsPrivileged) {

                const filters = await this._validator.search(request);
                const searchResults = await this._service.getPatientByPhone(filters);
                const count = searchResults.Items.length;
                const message =
                    count === 0 ? 'No records found!' : `Total ${count} patient records retrieved successfully!`;

                ResponseHandler.success(request, response, message, 200, {
                    Patients : searchResults,
                });
            } else {
                throw new ApiError(404, 'Only privileged clients are allowed to access this API!');
            }

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByPhone = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            const phone: string = await request.params.phone as string;
            const patientRole = await this._roleService.getByName(Roles.Patient);

            const user = await this._userService.getByPhoneAndRole(phone, patientRole.id);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, user.id, user.TenantId);

            const patient = await this._service.getByUserId(user.id);
            if (patient == null) {
                throw new ApiError(404, 'Patient not found.');
            }

            ResponseHandler.success(request, response, 'Patient retrieved successfully!', 200, {
                Patient : patient,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, user.id, user.TenantId);

            const updateModel = await this._validator.updateByUserId(request);
            const userDomainModel: UserDomainModel = updateModel.User;
            if (userDomainModel.Person.Phone != null) {
                await this.checkBeforeUpdatingPhone(userDomainModel, userId);
                //We identify test users only by phone currently!
                const IsTestUser = await this._userHelper.isTestUser(userDomainModel);
                userDomainModel.IsTestUser = IsTestUser;
            }

            // if timezone change detected then delete future medication schedules and create new one
            if (user.CurrentTimeZone !== request.body.CurrentTimeZone) {
                await this._userService.update(userId, { CurrentTimeZone: request.body.CurrentTimeZone });
                this.deleteAndCreateFutureMedicationSchedules(userId);
            }

            const updatedUser = await this._userService.update(userId, userDomainModel);
            if (!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const personDomainModel: PersonDomainModel = updateModel.User.Person;
            personDomainModel.id = updatedUser.Person.id;

            const healthProfile: HealthProfileDomainModel = {
                MaritalStatus             : personDomainModel.MaritalStatus,
                Race                      : personDomainModel.Race,
                Ethnicity                 : personDomainModel.Ethnicity,
                StrokeSurvivorOrCaregiver : personDomainModel.StrokeSurvivorOrCaregiver,
                LivingAlone               : personDomainModel.LivingAlone,
                WorkedPriorToStroke       : personDomainModel.WorkedPriorToStroke,
                OtherInformation          : updateModel.HealthProfile.OtherInformation,
            };
            await this._patientHealthProfileService.updateByPatientUserId(userId, healthProfile);

            if (userDomainModel.Person.Phone && (updatedUser.Person.Phone !== userDomainModel.Person.Phone)) {
                const isPersonExistsWithPhone = await this._personService.getPersonWithPhone(userDomainModel.Person.Phone);
                if (isPersonExistsWithPhone) {
                    throw new ApiError(409, `Person already exists with the phone ${userDomainModel.Person.Phone}`);
                }
            }

            if (userDomainModel.Person.Email && (updatedUser.Person.Email !== userDomainModel.Person.Email)) {
                const isPersonExistsWithEmail = await this._personService.getPersonWithEmail(userDomainModel.Person.Email);
                if (isPersonExistsWithEmail) {
                    throw new ApiError(409, `Person already exists with the email ${userDomainModel.Person.Email}`);
                }
            }

            if (userDomainModel.Person.UniqueReferenceId && (updatedUser.Person.UniqueReferenceId !== userDomainModel.Person.UniqueReferenceId)) {
                const isPersonExistsWithUniqueReferenceId = await this._personService.getPersonWithUniqueReferenceId(userDomainModel.Person.UniqueReferenceId);
                if (isPersonExistsWithUniqueReferenceId) {
                    throw new ApiError(409, `Person already exists with the unique reference id ${userDomainModel.Person.UniqueReferenceId}`);
                }
            }

            const updatedPerson = await this._personService.update(user.Person.id, personDomainModel);
            if (!updatedPerson) {
                throw new ApiError(400, 'Unable to update person!');
            }
            updateModel.HealthSystem = request.body.HealthSystem;
            updateModel.AssociatedHospital = request.body.AssociatedHospital;
            const updatedPatient = await this._service.updateByUserId(
                updatedUser.id,
                updateModel
            );
            if (updatedPatient == null) {
                throw new ApiError(400, 'Unable to update patient record!');
            }
            await this.createOrUpdateDefaultAddress(request, user.Person.id);
            const addresses = await this._personService.getAddresses(personDomainModel.id);
            let location = null;
            if (addresses.length >= 1) {
                location = addresses[0].Location;
            }

            await this._ehrPatientService.addEHRRecordPatientForAppNames(updatedPatient, location);

            const patient = await this._service.getByUserId(userId);

            UserEvents.onUserUpdated(request, patient.User);
            ResponseHandler.success(request, response, 'Patient records updated successfully!', 200, {
                Patient : patient,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const patient = await this._service.getByUserId(userId);
            if (!patient) {
                throw new ApiError(404, 'Patient account does not exist!');
            }
            const personId = patient.User.PersonId;
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, user.id, user.TenantId);

            let deleted = await this._service.deleteByUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            deleted = await this._patientHealthProfileService.deleteByPatientUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            deleted = await this._userDeviceDetailsService.deleteByUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            deleted = await this._cohortService.removeUserFromAllCohorts(userId);

            deleted = await this._userService.delete(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            const userDeleteEvent: UserDeleteEvent = {
                PatientUserId : userId,
                TenantId      : user.TenantId,
                TenantName    : user.TenantCode,
            };
            await this._patientDeleteService.enqueueDeletePatientData(userDeleteEvent);

            //TODO: Please add check here whether the patient-person
            //has other roles in the system
            const personDeleted = await this._personService.delete(personId);
            if (personDeleted == null) {
                Logger.instance().log(`Cannot delete person!`);
            }

            // invalidate all sessions
            var invalidatedAllSessions = await this._userService.invalidateAllSessions(userId);
            if (!invalidatedAllSessions) {
                throw new ApiError(400, 'User sessions cannot be deleted.');
            }

            // delete static ehr record
            await this._ehrPatientService.deleteStaticEHRRecord(userId);

            UserEvents.onUserDeleted(request, user);
            ResponseHandler.success(request, response, 'Patient records deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addPatientToCohort = async (patientUserId: uuid, cohortId: uuid) => {
        try {
            const cohort = await this._cohortService.getById(cohortId);
            if (cohort == null) {
                Logger.instance().log(`Cohort not found: ${cohortId}`);
                return;
            }
            const added = await this._cohortService.addUserToCohort(cohortId, patientUserId);
            if (!added) {
                throw new ApiError(400, 'Unable to add patient to cohort!');
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    private async checkBeforeUpdatingPhone(userDomainModel: UserDomainModel, userId: string) {
        const role: RoleDto = await this._roleService.getByName(Roles.Patient);
        if (role == null) {
            throw new ApiError(404, 'Role- ' + Roles.Patient + ' does not exist!');
        }
        const existing = await this._userService.getByPhoneAndRole(userDomainModel.Person.Phone, role.id);
        if (existing != null) {
            if (existing.id !== userId) {
                throw new ApiError(409, 'Phone number already exists with other patient!');
            }
        }
    }

    private deleteAndCreateFutureMedicationSchedules = async (patientUserId: string): Promise<boolean> => {
        var medications = await this._medicationService.getCurrentMedications(patientUserId);
        for await ( var m of medications) {
            if (m.FrequencyUnit !== 'Other') {
                var deletedMedicationCount = await this._medicationConsumptionService.deleteFutureMedicationSchedules(
                    m.id,
                    true
                );
                var startDate = await this._userService.getDateInUserTimeZone(m.PatientUserId, new Date().toISOString()
                    .split('T')[0]);
                if (m.FrequencyUnit === 'Weekly' || m.FrequencyUnit === 'Monthly') {
                    m.Duration = deletedMedicationCount;
                } else if (m.FrequencyUnit === 'Daily') {
                    m.Duration = Math.ceil(deletedMedicationCount / m.Frequency);
                }
                m.StartDate = startDate;
                await this._medicationConsumptionService.create(m);
            }
        }
        return true;
    };

    //#endregion

    //#region  Authorization methods

    authorizeSearch = async (
        request: express.Request,
        searchFilters: PatientSearchFilters): Promise<PatientSearchFilters> => {

        if (request.currentClient?.IsPrivileged) {
            return searchFilters;
        }

        const currentUser = request.currentUser;
        const currentRole = request.currentUser.CurrentRole;

        if (searchFilters.TenantId != null) {
            if (searchFilters.TenantId !== request.currentUser.TenantId) {
                if (currentRole !== Roles.SystemAdmin &&
                    currentRole !== Roles.SystemUser) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.TenantId = currentUser.TenantId;
        }
        return searchFilters;
    };

    //#endregion

}
