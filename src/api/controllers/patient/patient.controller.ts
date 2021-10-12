import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { PersonDomainModel } from '../../../domain.types/person/person.domain.model';
import { Roles } from '../../../domain.types/role/role.types';
import { UserDomainModel } from '../../../domain.types/user/user/user.domain.model';
import { HealthProfileService } from '../../../services/patient/health.profile.service';
import { PatientService } from '../../../services/patient/patient.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user/user.service';
import { Loader } from '../../../startup/loader';
import { PatientValidator } from '../../validators/patient/patient.validator';
import { BaseUserController } from '../base.user.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientController extends BaseUserController{

    //#region member variables and constructors

    _service: PatientService = null;

    _userService: UserService = null;

    _roleService: RoleService = null;

    _patientHealthProfileService: HealthProfileService = null;

    _authorizer: Authorizer = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(PatientService);
        this._userService = Loader.container.resolve(UserService);
        this._roleService = Loader.container.resolve(RoleService);
        this._patientHealthProfileService = Loader.container.resolve(HealthProfileService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Patient.Create';

            const patientDomainModel = await PatientValidator.create(request);

            //Throw an error if patient with same name and phone number exists
            const existingPatientCountSharingPhone = await this._service.checkforDuplicatePatients(
                patientDomainModel
            );

            //NOTE: Currently we are not allowing multiple patients to share same phone number,
            // but in future, we will be. For example, family members sharing the same phone number.
            // But for now, throw the error!

            if (existingPatientCountSharingPhone > 0) {
                const msg = `Patient already exists with this phone number. Please verify with OTP to gain access to the patient account.`;
                throw new ApiError(409, msg);
            }
            
            const userName = await this._userService.generateUserName(
                patientDomainModel.User.Person.FirstName,
                patientDomainModel.User.Person.LastName
            );

            const displayId = await this._userService.generateUserDisplayId(
                Roles.Patient,
                patientDomainModel.User.Person.Phone,
                existingPatientCountSharingPhone
            );

            const displayName = Helper.constructPersonDisplayName(
                patientDomainModel.User.Person.Prefix,
                patientDomainModel.User.Person.FirstName,
                patientDomainModel.User.Person.LastName
            );

            patientDomainModel.User.Person.DisplayName = displayName;
            patientDomainModel.User.UserName = userName;
            patientDomainModel.DisplayId = displayId;

            const userDomainModel = patientDomainModel.User;
            const personDomainModel = userDomainModel.Person;

            //Create a person first

            let person = await this._personService.getPersonWithPhone(patientDomainModel.User.Person.Phone);
            if (person == null) {
                person = await this._personService.create(personDomainModel);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }

            const role = await this._roleService.getByName(Roles.Patient);
            patientDomainModel.PersonId = person.id;
            userDomainModel.Person.id = person.id;
            userDomainModel.RoleId = role.id;

            const user = await this._userService.create(userDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            patientDomainModel.UserId = user.id;

            //KK: Note - Please add user to appointment service here...
            // var appointmentCustomerModel = PatientMapper.ToAppointmentCustomerDomainModel(userDomainModel);
            // var customer = await this._appointmentService.createCustomer(appointmentCustomerModel);

            patientDomainModel.DisplayId = displayId;
            const patient = await this._service.create(patientDomainModel);
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
            request.context = 'Patient.GetByUserId';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const userId: string = await PatientValidator.getByUserId(request);

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
            request.context = 'Patient.Search';
            await this._authorizer.authorize(request, response);

            const filters = await PatientValidator.search(request);

            // const extractFull: boolean =
            //     request.query.fullDetails !== 'undefined' && typeof request.query.fullDetails === 'boolean'
            //         ? request.query.fullDetails
            //         : false;

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
            request.context = 'Patient.UpdateByUserId';
            await this._authorizer.authorize(request, response);

            const patientDomainModel = await PatientValidator.updateByUserId(request);

            const userId: string = await PatientValidator.getByUserId(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const userDomainModel: UserDomainModel = patientDomainModel.User;
            const updatedUser = await this._userService.update(userId, userDomainModel);
            if (!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const personDomainModel: PersonDomainModel = patientDomainModel.User.Person;
            personDomainModel.id = updatedUser.Person.id;
            const updatedPerson = await this._personService.update(existingUser.Person.id, personDomainModel);
            if (!updatedPerson) {
                throw new ApiError(400, 'Unable to update person!');
            }
            const updatedPatient = await this._service.updateByUserId(
                patientDomainModel.UserId,
                patientDomainModel
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
            request.context = 'Patient.DeleteByUserId';
            await this._authorizer.authorize(request, response);

            const userId: string = await PatientValidator.delete(request);
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
