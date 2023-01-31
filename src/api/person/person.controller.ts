import express from 'express';
import { Authorizer } from '../../auth/authorizer';
import { ApiError } from '../../common/api.error';
import { ResponseHandler } from '../../common/response.handler';
import { AddressService } from '../../services/general/address.service';
import { OrganizationService } from '../../services/general/organization.service';
import { PersonService } from '../../services/person/person.service';
import { UserService } from '../../services/users/user/user.service';
import { Loader } from '../../startup/loader';
import { PersonValidator } from './person.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PersonController {

    //#region member variables and constructors

    _service: PersonService = null;

    _userService: UserService = null;

    _addressService: AddressService = null;

    _organizationService: OrganizationService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(PersonService);
        this._userService = Loader.container.resolve(UserService);
        this._addressService = Loader.container.resolve(AddressService);
        this._organizationService = Loader.container.resolve(OrganizationService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Person.GetById';
            await this._authorizer.authorize(request, response);

            const id: string = await PersonValidator.validateId(request);
            const person = await this._service.getById(id);
            if (person == null) {
                ResponseHandler.failure(request, response, 'Person not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'Person retrieved successfully!', 200, {
                Person : person,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAllPersonsWithPhoneAndRole = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Person.GetAllPersonsWithPhoneAndRole';
            await this._authorizer.authorize(request, response);

            const { phone, roleId } = await PersonValidator.getAllPersonsWithPhoneAndRole(request);
            const persons = await this._service.getAllPersonsWithPhoneAndRole(phone, roleId);
            const message =
                persons.length === 0 ?
                    'No records found!' : `Total ${persons.length} person records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Persons : persons,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getOrganizations = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Person.GetOrganizations';
            await this._authorizer.authorize(request, response);

            const id: string = await PersonValidator.validateId(request);
            const organizations = await this._service.getOrganizations(id);

            const message = organizations.length === 0 ?
                'No records found!' : `Total ${organizations.length} organization records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Organizations : organizations,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addAddress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Person.AddAddress';
            await this._authorizer.authorize(request, response);

            const { id, addressId } = await PersonValidator.addOrRemoveAddress(request);
            const person = await this._service.getById(id);
            if (person == null) {
                throw new ApiError(404, 'Person not found.');
            }

            const added = await this._service.addAddress(id, addressId);
            if (!added) {
                throw new ApiError(400, 'Organization address cannot be added.');
            }

            ResponseHandler.success(request, response, 'Person address record added successfully!', 200, {
                Added : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeAddress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Person.RemoveAddress';
            await this._authorizer.authorize(request, response);

            const { id, addressId } = await PersonValidator.addOrRemoveAddress(request);
            const person = await this._service.getById(id);
            if (person == null) {
                throw new ApiError(404, 'Person not found.');
            }

            const removed = await this._service.removeAddress(id, addressId);
            if (!removed) {
                throw new ApiError(400, 'Person address cannot be removed.');
            }

            ResponseHandler.success(request, response, 'Organization address record removed successfully!', 200, {
                Removed : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAddresses = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Person.GetAddresses';
            await this._authorizer.authorize(request, response);

            const id: string = await PersonValidator.validateId(request);
            const addresses = await this._service.getAddresses(id);

            const message = addresses.length === 0 ?
                'No records found!' : `Total ${addresses.length} address records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Addresses : addresses,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAllPersonsWithPhone = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Person.GetAllPersonsWithPhone';

            const { phone } = await PersonValidator.getAllPersonsWithPhone(request);
            const persons = await this._service.getPersonWithPhone(phone);
            const message =
                persons ? `Person record retrieved successfully!` : 'No records found!';
                
            ResponseHandler.success(request, response, message, 200, {
                Persons : persons,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
