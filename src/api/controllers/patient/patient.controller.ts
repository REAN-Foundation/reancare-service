import express from 'express';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { PersonDomainModel } from '../../../domain.types/person/person.domain.model';
import { Roles } from '../../../domain.types/role/role.types';
import { UserDomainModel } from '../../../domain.types/user/user/user.domain.model';
import { HealthProfileService } from '../../../services/patient/health.profile.service';
import { PatientService } from '../../../services/patient/patient.service';
import { Loader } from '../../../startup/loader';
import { PatientValidator } from '../../validators/patient/patient.validator';
import { BaseUserController } from '../base.user.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientController extends BaseUserController{

    //#region member variables and constructors

    _service: PatientService = null;

    _patientHealthProfileService: HealthProfileService = null;

    _validator = new PatientValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(PatientService);
        this._patientHealthProfileService = Loader.container.resolve(HealthProfileService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Patient.Create', request, response, false);

            const createModel = await this._validator.create(request);

            //Throw an error if patient with same name and phone number exists
            const existingPatientCountSharingPhone = await this._service.checkforDuplicatePatients(
                createModel
            );

            //NOTE: Currently we are not allowing multiple patients to share same phone number,
            // but in future, we will be. For example, family members sharing the same phone number.
            // But for now, throw the error!

            if (existingPatientCountSharingPhone > 0) {
                const msg = `Patient already exists with this phone number. Please verify with OTP to gain access to the patient account.`;
                throw new ApiError(409, msg);
            }
            
            const userName = await this._userService.generateUserName(
                createModel.User.Person.FirstName,
                createModel.User.Person.LastName
            );

            const displayId = await this._userService.generateUserDisplayId(
                Roles.Patient,
                createModel.User.Person.Phone,
                existingPatientCountSharingPhone
            );

            const displayName = Helper.constructPersonDisplayName(
                createModel.User.Person.Prefix,
                createModel.User.Person.FirstName,
                createModel.User.Person.LastName
            );

            createModel.User.Person.DisplayName = displayName;
            createModel.User.UserName = userName;
            createModel.DisplayId = displayId;

            const userDomainModel = createModel.User;
            const personDomainModel = userDomainModel.Person;

            //Create a person first

            let person = await this._personService.getPersonWithPhone(createModel.User.Person.Phone);
            if (person == null) {
                person = await this._personService.create(personDomainModel);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }

            const role = await this._roleService.getByName(Roles.Patient);
            createModel.PersonId = person.id;
            userDomainModel.Person.id = person.id;
            userDomainModel.RoleId = role.id;

            const user = await this._userService.create(userDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            createModel.UserId = user.id;

            //KK: Note - Please add user to appointment service here...
            // var appointmentCustomerModel = PatientMapper.ToAppointmentCustomerDomainModel(userDomainModel);
            // var customer = await this._appointmentService.createCustomer(appointmentCustomerModel);

            createModel.DisplayId = displayId;
            const patient = await this._service.create(createModel);
            if (patient == null) {
                throw new ApiError(400, 'Cannot create patient!');
            }

            const healthProfile = await this._patientHealthProfileService.createDefault(user.id);
            patient.HealthProfile = healthProfile;

            if (person.Phone !== null) {
                var otpDetails = {
                    Phone   : person.Phone,
                    Email   : null,
                    UserId  : null,
                    Purpose : 'Login',
                    RoleId  : role.id
                };
                await this._userService.generateOtp(otpDetails);
            }

            ResponseHandler.success(request, response, 'Patient created successfully!', 201, {
                Patient : patient,
            });
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
            await this.setContext('Patient.Search', request, response);

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
            const updatedUser = await this._userService.update(userId, userDomainModel);
            if (!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const personDomainModel: PersonDomainModel = updateModel.User.Person;
            personDomainModel.id = updatedUser.Person.id;
            const updatedPerson = await this._personService.update(existingUser.Person.id, personDomainModel);
            if (!updatedPerson) {
                throw new ApiError(400, 'Unable to update person!');
            }
            const updatedPatient = await this._service.updateByUserId(
                updatedUser.id,
                updateModel
            );
            if (updatedPatient == null) {
                throw new ApiError(400, 'Unable to update patient record!');
            }

            await this.createOrUpdateDefaultAddress(request, existingUser.Person.id);

            const patient = await this._service.getByUserId(userId);

            ResponseHandler.success(request, response, 'Patient records updated successfully!', 200, {
                Patient : patient,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Patient.DeleteByUserId', request, response);

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const deleted = await this._personService.delete(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Patient records deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
