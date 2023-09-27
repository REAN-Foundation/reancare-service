import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { Loader } from '../../../startup/loader';
import { OrganizationValidator } from './organization.validator';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class OrganizationController {

    //#region member variables and constructors

    _service: OrganizationService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _authorizer: Authorizer = null;

    _validator: OrganizationValidator = new OrganizationValidator();

    constructor() {
        this._service = Loader.container.resolve(OrganizationService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.Create';

            const domainModel = await this._validator.create(request);

            if (domainModel.ParentOrganizationId != null) {
                const person = await this._service.getById(domainModel.ParentOrganizationId);
                if (person == null) {
                    throw new ApiError(404, `Parent organization with an id ${domainModel.ParentOrganizationId} cannot be found.`);
                }
            }

            const organization = await this._service.create(domainModel);
            if (organization == null) {
                throw new ApiError(400, 'Cannot create organization!');
            }

            ResponseHandler.success(request, response, 'Organization created successfully!', 201, {
                Organization : organization,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.GetById';

            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const organization = await this._service.getById(id);
            if (organization == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            ResponseHandler.success(request, response, 'Organization retrieved successfully!', 200, {
                Organization : organization,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByContactUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.GetByContactUserId';

            await this._authorizer.authorize(request, response);

            const contactUserId: uuid = await this._validator.getParamUuid(request, 'id');

            const organization = await this._service.getByContactUserId(contactUserId);
            if (organization == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            ResponseHandler.success(request, response, 'Organization retrieved successfully!', 200, {
                Organization : organization,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.Search';
            await this._authorizer.authorize(request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} organization records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { Organizations: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingOrganization = await this._service.getById(id);
            if (existingOrganization == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update organization record!');
            }

            ResponseHandler.success(request, response, 'Organization record updated successfully!', 200, {
                Organization : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.Delete';
            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
        
            const existingOrganization = await this._service.getById(id);
            if (existingOrganization == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Organization cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Organization record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addAddress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.AddAddress';
            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const addressId: uuid = await this._validator.getParamUuid(request, 'addressId');
            const existingOrganization = await this._service.getById(id);
            if (existingOrganization == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            const added = await this._service.addAddress(id, addressId);
            if (!added) {
                throw new ApiError(400, 'Organization address cannot be added.');
            }

            ResponseHandler.success(request, response, 'Organization address record added successfully!', 200, {
                Added : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeAddress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.RemoveAddress';
            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const addressId: uuid = await this._validator.getParamUuid(request, 'addressId');
            const existingOrganization = await this._service.getById(id);
            if (existingOrganization == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            const removed = await this._service.removeAddress(id, addressId);
            if (!removed) {
                throw new ApiError(400, 'Organization address cannot be removed.');
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
            request.context = 'Organization.GetAddresses';
            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

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

    addPerson = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.AddPerson';
            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const personId: uuid = await this._validator.getParamUuid(request, 'personId');

            const existingOrganization = await this._service.getById(id);
            if (existingOrganization == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            const added = await this._service.addPerson(id, personId);
            if (!added) {
                throw new ApiError(400, 'Person cannot be added to the organization.');
            }

            ResponseHandler.success(request, response, 'Person added to organization successfully!', 200, {
                Added : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removePerson = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.RemovePerson';
            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const personId: uuid = await this._validator.getParamUuid(request, 'personId');

            const existingOrganization = await this._service.getById(id);
            if (existingOrganization == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            const removed = await this._service.removePerson(id, personId);
            if (!removed) {
                throw new ApiError(400, 'Person cannot be removed from the organization..');
            }

            ResponseHandler.success(request, response, 'Person removed from organization successfully!', 200, {
                Removed : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPersons = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Organization.GetPersons';
            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const persons = await this._service.getPersons(id);

            const message = persons.length === 0 ?
                'No records found!' : `Total ${persons.length} person records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Persons : persons,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
