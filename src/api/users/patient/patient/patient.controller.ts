import express from 'express';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { HealthProfileService } from '../../../../services/users/patient/health.profile.service';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { CohortService } from '../../../../services/community/cohort.service';
import { Loader } from '../../../../startup/loader';
import { PatientValidator } from './patient.validator';
import { BaseUserController } from '../../base.user.controller';
import { UserHelper } from '../../user.helper';
import { UserDeviceDetailsService } from '../../../../services/users/user/user.device.details.service';
import { PersonService } from '../../../../services/person/person.service';
import { UserService } from '../../../../services/users/user/user.service';
import { CustomActionsHandler } from '../../../../custom/custom.actions.handler';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { HealthProfileDomainModel } from '../../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { RoleDto } from '../../../../domain.types/role/role.dto';
import { Roles } from '../../../../domain.types/role/role.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientController extends BaseUserController {

    //#region member variables and constructors

    _service: PatientService = null;

    _userService: UserService = null;

    _patientHealthProfileService: HealthProfileService = null;

    _personService: PersonService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    _userHelper: UserHelper = new UserHelper();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _customActionHandler: CustomActionsHandler = new CustomActionsHandler();

    _cohortService: CohortService = null;

    _validator = new PatientValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(PatientService);
        this._userService = Loader.container.resolve(UserService);
        this._personService = Loader.container.resolve(PersonService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
        this._patientHealthProfileService = Loader.container.resolve(HealthProfileService);
        this._cohortService = Loader.container.resolve(CohortService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Patient.Create', request, response, false);

            const createModel = await this._validator.create(request);
            const [ patient, createdNew ] = await this._userHelper.createPatient(createModel);

            if (createModel.CohortId != null) {
                await this.addPatientToCohort(patient.UserId, createModel.CohortId);
            }

            const clientCode = request.currentClient.ClientCode;
            await this._customActionHandler.performActions_PostRegistration(patient, clientCode);

            // get user details to add records in ehr database
            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(patient.UserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this.addPatientToEHRRecords(patient.UserId, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${patient.UserId}`);
            }

            if (createdNew) {
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
            await this.setContext('Patient.GetByUserId', request, response);

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

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
            await this.setContext('Patient.Search', request, response, false);

            const filters = await this._validator.search(request);
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

    getPatientByPhone = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Patient.GetPatientByPhone', request, response, false);

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

    updateByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Patient.UpdateByUserId', request, response);

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const updateModel = await this._validator.updateByUserId(request);
            const userDomainModel: UserDomainModel = updateModel.User;
            if (userDomainModel.Person.Phone != null) {
                await this.checkBeforeUpdatingPhone(userDomainModel, userId);
                //We identify test users only by phone currently!
                const IsTestUser = await this._userHelper.isTestUser(userDomainModel);
                userDomainModel.IsTestUser = IsTestUser;
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
            const updatedHealthProfile = await this._patientHealthProfileService.updateByPatientUserId(userId, healthProfile);
            const updatedPerson = await this._personService.update(existingUser.Person.id, personDomainModel);
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
            await this.createOrUpdateDefaultAddress(request, existingUser.Person.id);
            const addresses = await this._personService.getAddresses(personDomainModel.id);
            let location = null;
            if (addresses.length >= 1) {
                location = addresses[0].Location;
            }

            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(userId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) {
                    await this._service.addEHRRecord(userId, personDomainModel, updatedPatient, location, updatedHealthProfile, appName);       
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${userId}`);
            }

            const patient = await this._service.getByUserId(userId);

            ResponseHandler.success(request, response, 'Patient records updated successfully!', 200, {
                Patient : patient,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Patient.DeleteByUserId', request, response);

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const currentUserId = request.currentUser.UserId;
            const patientUserId = userId;
            const patient = await this._service.getByUserId(userId);
            if (!patient) {
                throw new ApiError(404, 'Patient account does not exist!');
            }
            const personId = patient.User.PersonId;
            if (currentUserId !== patientUserId) {
                throw new ApiError(403, 'You do not have permissions to delete this patient account.');
            }
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }
            var deleted = await this._userDeviceDetailsService.deleteByUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }
            deleted = await this._patientHealthProfileService.deleteByPatientUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }
            deleted = await this._cohortService.removeUserFromAllCohorts(userId);
            deleted = await this._userService.delete(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }
            deleted = await this._service.deleteByUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }
            //TODO: Please add check here whether the patient-person
            //has other roles in the system
            deleted = await this._personService.delete(personId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }
            // invalidate all sessions
            var invalidatedAllSessions = await this._userService.invalidateAllSessions(request.currentUser.UserId);
            if (!invalidatedAllSessions) {
                throw new ApiError(400, 'User sessions cannot be deleted.');
            }

            // delete static ehr record
            this._ehrAnalyticsHandler.deleteStaticEHRRecord(userId);

            ResponseHandler.success(request, response, 'Patient records deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addPatientToEHRRecords = (patientUserId: uuid, appName?: string) => {
        EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {}, appName,);
    };

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

    //#endregion

}
