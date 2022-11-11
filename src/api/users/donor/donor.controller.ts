import express from 'express';
import { DonorService } from '../../../services/users/donor.service';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { PersonDomainModel } from '../../../domain.types/person/person.domain.model';
import { Roles } from '../../../domain.types/role/role.types';
import { UserDomainModel } from '../../../domain.types/users/user/user.domain.model';
import { Loader } from '../../../startup/loader';
import { DonorValidator } from './donor.validator';
import { BaseUserController } from '../base.user.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class DonorController extends BaseUserController {

    //#region member variables and constructors

    _service: DonorService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(DonorService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Donor.Create';

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

            const user = await this._userService.create(userDomainModel);
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
            request.context = 'Donor.GetByUserId';

            await this._authorizer.authorize(request, response);

            const userId: string = await DonorValidator.getByUserId(request);

            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const donor = await this._service.getByUserId(userId);
            if (donor == null) {
                throw new ApiError(404, 'Donor not found.');
            }

            ResponseHandler.success(request, response, 'Donor retrieved successfully!', 200, {
                Donor : donor,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Donor.Search';
            await this._authorizer.authorize(request, response);

            const filters = await DonorValidator.search(request);

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
            request.context = 'Donor.UpdateByUserId';
            await this._authorizer.authorize(request, response);

            const donorDomainModel = await DonorValidator.updateByUserId(request);

            const userId: string = await DonorValidator.getByUserId(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

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

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Donor.DeleteByUserId';
            await this._authorizer.authorize(request, response);

            const userId: string = await DonorValidator.delete(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const deleted = await this._personService.delete(existingUser.PersonId);
            await this._service.deleteByUserId(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Donor records deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
