import express from 'express';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { PersonDomainModel } from '../../../domain.types/person/person.domain.model';
import { Roles } from '../../../domain.types/role/role.types';
import { UserDomainModel } from '../../../domain.types/users/user/user.domain.model';
import { DoctorService } from '../../../services/users/doctor.service';
import { Loader } from '../../../startup/loader';
import { DoctorValidator } from './doctor.validator';
import { BaseUserController } from '../base.user.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorController extends BaseUserController {

    //#region member variables and constructors

    _service: DoctorService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(DoctorService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.Create';

            const doctorDomainModel = await DoctorValidator.create(request);

            //Throw an error if doctor with same name and phone number exists
            const doctorExists = await this._service.doctorExists(doctorDomainModel);
            if (doctorExists) {
                throw new ApiError(400, 'Cannot create doctor! Doctor with same phone number exists.');
            }

            const userName = await this._userService.generateUserName(
                doctorDomainModel.User.Person.FirstName,
                doctorDomainModel.User.Person.LastName
            );

            const displayId = await this._userService.generateUserDisplayId(
                Roles.Doctor,
                doctorDomainModel.User.Person.Phone
            );

            const displayName = Helper.constructPersonDisplayName(
                doctorDomainModel.User.Person.Prefix,
                doctorDomainModel.User.Person.FirstName,
                doctorDomainModel.User.Person.LastName
            );

            doctorDomainModel.User.Person.DisplayName = displayName;
            doctorDomainModel.User.UserName = userName;
            doctorDomainModel.DisplayId = displayId;

            const userDomainModel = doctorDomainModel.User;
            const personDomainModel = userDomainModel.Person;

            //Create a person first

            let person = await this._personService.getPersonWithPhone(doctorDomainModel.User.Person.Phone);
            if (person == null) {
                person = await this._personService.create(personDomainModel);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }

            const role = await this._roleService.getByName(Roles.Doctor);
            doctorDomainModel.PersonId = person.id;
            userDomainModel.Person.id = person.id;
            userDomainModel.RoleId = role.id;

            const user = await this._userService.create(userDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            doctorDomainModel.UserId = user.id;

            //KK: Note - Please add user to appointment service here...

            doctorDomainModel.DisplayId = displayId;
            const doctor = await this._service.create(doctorDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create doctor!');
            }

            await this.addAddress(request, person.id);

            ResponseHandler.success(request, response, 'Doctor created successfully!', 201, {
                Doctor : doctor,
            });

        } catch (error) {

            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.GetByUserId';

            await this._authorizer.authorize(request, response);

            const userId: string = await DoctorValidator.getByUserId(request);

            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const doctor = await this._service.getByUserId(userId);
            if (doctor == null) {
                throw new ApiError(404, 'Doctor not found.');
            }

            ResponseHandler.success(request, response, 'Doctor retrieved successfully!', 200, {
                Doctor : doctor,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.Search';
            await this._authorizer.authorize(request, response);

            const filters = await DoctorValidator.search(request);

            // const extractFull: boolean =
            //     request.query.fullDetails !== 'undefined' && typeof request.query.fullDetails === 'boolean'
            //         ? request.query.fullDetails
            //         : false;

            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} doctor records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Doctors : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.UpdateByUserId';
            await this._authorizer.authorize(request, response);

            const doctorDomainModel = await DoctorValidator.updateByUserId(request);

            const userId: string = await DoctorValidator.getByUserId(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const userDomainModel: UserDomainModel = doctorDomainModel.User;
            const updatedUser = await this._userService.update(doctorDomainModel.User.id, userDomainModel);
            if (!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const personDomainModel: PersonDomainModel = doctorDomainModel.User.Person;
            personDomainModel.id = updatedUser.Person.id;
            const updatedPerson = await this._personService.update(personDomainModel.id, personDomainModel);
            if (!updatedPerson) {
                throw new ApiError(400, 'Unable to update person!');
            }
            const updatedDoctor = await this._service.updateByUserId(
                doctorDomainModel.UserId,
                doctorDomainModel
            );
            if (updatedDoctor == null) {
                throw new ApiError(400, 'Unable to update doctor record!');
            }

            await this.createOrUpdateDefaultAddress(request, existingUser.Person.id);

            ResponseHandler.success(request, response, 'Doctor records updated successfully!', 200, {
                Doctor : updatedDoctor,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.DeleteByUserId';
            await this._authorizer.authorize(request, response);

            const userId: string = await DoctorValidator.delete(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const deleted = await this._personService.delete(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Doctor records deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
