import express from 'express';
import { DonorService } from '../../../../services/assorted/blood.donation/donor.service';
import { ApiError } from '../../../../common/api.error';
import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { Roles } from '../../../../domain.types/role/role.types';
import { UserDomainModel } from '../../../../domain.types/users/user/user.domain.model';
import { DonorValidator } from './donor.validator';
import { BaseUserController } from '../../../users/base.user.controller';
import { Injector } from '../../../../startup/injector';
import { DonorSearchFilters } from '../../../../domain.types/assorted/blood.donation/donor/donor.search.types';
import { UserHelper } from '../../../users/user.helper';
import { Logger } from '../../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class DonorController extends BaseUserController {

    //#region member variables and constructors

    _service: DonorService = Injector.Container.resolve(DonorService);

    _userHelper: UserHelper = new UserHelper();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const donorDomainModel = await DonorValidator.create(request);

            //Throw an error if donor with same name and phone number exists
            const donorExists = await this._service.donorExists(donorDomainModel);
            if (donorExists) {
                throw new ApiError(400, 'Cannot create donor! Donor with same phone number exists.');
            }

            const userName = await this._userService.generateUserName(
                donorDomainModel.User.Person.FirstName,
                donorDomainModel.User.Person.LastName
            );

            const displayId = await this._userService.generateUserDisplayId(
                Roles.Donor,
                donorDomainModel.User.Person.Phone
            );

            const displayName = Helper.constructPersonDisplayName(
                donorDomainModel.User.Person.Prefix,
                donorDomainModel.User.Person.FirstName,
                donorDomainModel.User.Person.LastName
            );

            donorDomainModel.User.Person.DisplayName = displayName;
            donorDomainModel.User.UserName = userName;
            donorDomainModel.DisplayId = displayId;

            const userDomainModel = donorDomainModel.User;
            const personDomainModel = userDomainModel.Person;

            //Create a person first

            let person = await this._personService.getPersonWithPhone(donorDomainModel.User.Person.Phone);
            if (person == null) {
                person = await this._personService.create(personDomainModel);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }

            const role = await this._roleService.getByName(Roles.Donor);
            donorDomainModel.PersonId = person.id;
            userDomainModel.Person.id = person.id;
            userDomainModel.RoleId = role.id;

            const user = await this._userHelper.createUser(person, donorDomainModel, role.id);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            donorDomainModel.UserId = user.id;

            //KK: Note - Please add user to appointment service here...

            donorDomainModel.DisplayId = displayId;
            const donor = await this._service.create(donorDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create donor!');
            }

            await this.addAddress(request, person.id);

            ResponseHandler.success(request, response, 'Donor created successfully!', 201, {
                Donor : donor,
            });

        } catch (error) {

            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: string = await DonorValidator.getByUserId(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }
            const donor = await this._service.getByUserId(userId);
            if (donor == null) {
                throw new ApiError(404, 'Donor not found.');
            }
            await this.authorizeOne(request, null, donor.TenantId);
            ResponseHandler.success(request, response, 'Donor retrieved successfully!', 200, {
                Donor : donor,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            let filters = await DonorValidator.search(request);
            filters = this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} donor records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Donors : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const donorDomainModel = await DonorValidator.updateByUserId(request);

            const userId: string = await DonorValidator.getByUserId(request);
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
            const updatedDonor = await this._service.updateByUserId(
                donorDomainModel.UserId,
                donorDomainModel
            );
            if (updatedDonor == null) {
                throw new ApiError(400, 'Unable to update donor record!');
            }

            await this.createOrUpdateDefaultAddress(request, existingUser.Person.id);

            ResponseHandler.success(request, response, 'Donor records updated successfully!', 200, {
                Donor : updatedDonor,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: string = await DonorValidator.delete(request);

            const currentUserId = request.currentUser.UserId;
            const donor = await this._service.getByUserId(userId);
            const personId = donor.User.PersonId;
            if (!donor) {
                throw new ApiError(404, 'Donor account does not exist!');
            }
            if (currentUserId !== userId) {
                throw new ApiError(403, 'You do not have permissions to delete this donor account.');
            }
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User does not exist!');
            }
            await this.authorizeOne(request, null, existingUser.TenantId);

            let deleted = await this._service.deleteByUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'Donor cannot be deleted.');
            }
            deleted = await this._userService.delete(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }
            
            const personDeleted = await this._personService.delete(personId);
            if (personDeleted == null) {
                Logger.instance().log(`Cannot delete person!`);
            }
            
            var invalidatedAllSessions = await this._userService.invalidateAllSessions(request.currentUser.UserId);
            if (!invalidatedAllSessions) {
                throw new ApiError(400, 'Donor sessions cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Donor records deleted successfully!', 200, {
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
        filters: DonorSearchFilters) => {
        
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
