import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { PersonDomainModel } from '../../../domain.types/person/person.domain.model';
import { UserDomainModel } from '../../../domain.types/users/user/user.domain.model';
import { DoctorService } from '../../../services/users/doctor/doctor.service';
import { DoctorValidator } from './doctor.validator';
import { BaseUserController } from '../base.user.controller';
import { Injector } from '../../../startup/injector';
import { UserHelper } from '../user.helper';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorController extends BaseUserController {

    //#region member variables and constructors

    _service: DoctorService = null;

    _userHelper: UserHelper = new UserHelper();

    constructor() {
        super();
        this._service = Injector.Container.resolve(DoctorService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const createModel = await DoctorValidator.create(request);
            const [ doctor, createdNew ] = await this._userHelper.createDoctor(createModel);

            if (createdNew) {
                ResponseHandler.success(request, response, 'Doctor created successfully!', 201, {
                    Doctor : doctor,
                });
                return;
            }
            ResponseHandler.failure(request, response, `Doctor account already exists!`, 409);
        } catch (error) {
            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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

    deleteByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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
