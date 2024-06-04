import express from 'express';
import { VolunteerService } from '../../../../services/assorted/blood.donation/volunteer.service';
import { ApiError } from '../../../../common/api.error';
import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { Roles } from '../../../../domain.types/role/role.types';
import { UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { BaseUserController } from '../../../users/base.user.controller';
import { VolunteerValidator } from './volunteer.validator';
import { Injector } from '../../../../startup/injector';
import { VolunteerSearchFilters } from '../../../../domain.types/assorted/blood.donation/volunteer/volunteer.search.types';
import { UserHelper } from '../../../users/user.helper';

///////////////////////////////////////////////////////////////////////////////////////

export class VolunteerController extends BaseUserController {

    //#region member variables and constructors

    _service: VolunteerService = null;

    _userHelper: UserHelper = new UserHelper();

    constructor() {
        super();
        this._service = Injector.Container.resolve(VolunteerService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await VolunteerValidator.create(request);

            //Throw an error if donor with same name and phone number exists
            const donorExists = await this._service.volunteerExists(model);
            if (donorExists) {
                throw new ApiError(400, 'Cannot create volunteer! Volunteer with same phone number exists.');
            }

            const userName = await this._userService.generateUserName(
                model.User.Person.FirstName,
                model.User.Person.LastName
            );

            const displayId = await this._userService.generateUserDisplayId(
                Roles.Volunteer,
                model.User.Person.Phone
            );

            const displayName = Helper.constructPersonDisplayName(
                model.User.Person.Prefix,
                model.User.Person.FirstName,
                model.User.Person.LastName
            );

            model.User.Person.DisplayName = displayName;
            model.User.UserName = userName;
            model.DisplayId = displayId;

            const userDomainModel = model.User;
            const personDomainModel = userDomainModel.Person;

            //Create a person first

            let person = await this._personService.getPersonWithPhone(model.User.Person.Phone);
            if (person == null) {
                person = await this._personService.create(personDomainModel);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }

            const role = await this._roleService.getByName(Roles.Volunteer);
            model.PersonId = person.id;
            userDomainModel.Person.id = person.id;
            userDomainModel.RoleId = role.id;

            const user = await this._userHelper.createUser(person, model, role.id);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            model.UserId = user.id;

            //KK: Note - Please add user to appointment service here...

            model.DisplayId = displayId;
            const volunteer = await this._service.create(model);
            if (user == null) {
                throw new ApiError(400, 'Cannot create volunteer!');
            }

            await this.addAddress(request, person.id);

            ResponseHandler.success(request, response, 'Volunteer created successfully!', 201, {
                Volunteer : volunteer,
            });

        } catch (error) {

            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: string = await VolunteerValidator.getByUserId(request);

            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const volunteer = await this._service.getByUserId(userId);
            if (volunteer == null) {
                throw new ApiError(404, 'Volunteer not found.');
            }
            await this.authorizeOne(request, null, volunteer.TenantId);
            ResponseHandler.success(request, response, 'Volunteer retrieved successfully!', 200, {
                Volunteer : volunteer,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            let filters = await VolunteerValidator.search(request);
            filters = this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} volunteer records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Volunteers : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const donorDomainModel = await VolunteerValidator.updateByUserId(request);

            const userId: string = await VolunteerValidator.getByUserId(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, null, existingUser.TenantId);

            const userDomainModel: UserDomainModel = donorDomainModel.User;
            const updatedUser = await this._userService.update(donorDomainModel.User.id, userDomainModel);
            if (!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const personDomainModel: PersonDomainModel = donorDomainModel.User.Person;
            personDomainModel.id = updatedUser.Person.id;
            const updatedPerson = await this._personService.update(personDomainModel.id, personDomainModel);
            if (!updatedPerson) {
                throw new ApiError(400, 'Unable to update person!');
            }
            const updatedVolunteer = await this._service.updateByUserId(
                donorDomainModel.UserId,
                donorDomainModel
            );
            if (updatedVolunteer == null) {
                throw new ApiError(400, 'Unable to update volunteer record!');
            }

            await this.createOrUpdateDefaultAddress(request, existingUser.Person.id);

            ResponseHandler.success(request, response, 'Volunteer records updated successfully!', 200, {
                Volunteer : updatedVolunteer,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: string = await VolunteerValidator.delete(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }
            await this.authorizeOne(request, null, existingUser.TenantId);
            const deleted = await this._personService.delete(existingUser.PersonId);
            await this._service.deleteByUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Volunteer records deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
    //#region Authorization methods

    authorizeSearch = (
        request: express.Request,
        filters: VolunteerSearchFilters) => {

        if (request.currentClient?.IsPrivileged) {
            return filters;
        }
            
        const currentUserRole = request.currentUser.CurrentRole;
        if (currentUserRole === Roles.SystemAdmin || currentUserRole === Roles.SystemUser ||
                currentUserRole === Roles.Volunteer || currentUserRole === Roles.TenantAdmin ||
                currentUserRole === Roles.TenantUser || currentUserRole === Roles.Donor) {
            return filters;
        }
        throw new ApiError(403, 'Unauthorized');
    };

    //#endregion

}
