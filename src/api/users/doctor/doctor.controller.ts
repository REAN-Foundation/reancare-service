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
import { DoctorSearchFilters } from '../../../domain.types/users/doctor/doctor.search.types';
import { Roles } from '../../../domain.types/role/role.types';
import { UserEvents } from '../user/user.events';
import { CohortService } from '../../../services/community/cohort.service';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorController extends BaseUserController {

    //#region member variables and constructors

    _service: DoctorService = Injector.Container.resolve(DoctorService);

    _cohortService: CohortService = Injector.Container.resolve(CohortService);

    _userHelper: UserHelper = new UserHelper();

    constructor() {
        super();
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
            UserEvents.onUserCreated(request, doctor.User);
            ResponseHandler.failure(request, response, `Doctor account already exists!`, 409);
        } catch (error) {
            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: string = await DoctorValidator.getByUserId(request);

            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, userId, user.TenantId);

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
            let filters: DoctorSearchFilters = await DoctorValidator.search(request);
            filters = await this.authorizeSearch(request, filters);

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
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, userId, user.TenantId);

            const userDomainModel: UserDomainModel = doctorDomainModel.User;
            const updatedUser = await this._userService.update(doctorDomainModel.User.id, userDomainModel);
            if (!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const personDomainModel: PersonDomainModel = doctorDomainModel.User.Person;
            personDomainModel.id = updatedUser.Person.id;
            
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

            await this.createOrUpdateDefaultAddress(request, user.Person.id);
            UserEvents.onUserUpdated(request, updatedUser);
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
            const currentUserId = request.currentUser.UserId;
            const doctor = await this._service.getByUserId(userId);
            const personId = doctor.User.PersonId;
            if (!doctor) {
                throw new ApiError(404, 'Doctor account does not exist!');
            }
            if (currentUserId !== userId) {
                throw new ApiError(403, 'You do not have permissions to delete this doctor account.');
            }
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, userId, user.TenantId);
            let deleted = await this._cohortService.removeUserFromAllCohorts(userId);
            deleted = await this._userService.delete(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }
            deleted = await this._service.deleteByUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'Doctor cannot be deleted.');
            }
            const personDeleted = await this._personService.delete(personId);
            if (personDeleted == null) {
                Logger.instance().log(`Cannot delete person!`);
            }
            var invalidatedAllSessions = await this._userService.invalidateAllSessions(request.currentUser.UserId);
            if (!invalidatedAllSessions) {
                throw new ApiError(400, 'Doctor sessions cannot be deleted.');
            }
            UserEvents.onUserDeleted(request, user);
            ResponseHandler.success(request, response, 'Doctor records deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region  Authorization methods

    authorizeSearch = async (
        request: express.Request,
        searchFilters: DoctorSearchFilters): Promise<DoctorSearchFilters> => {

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
