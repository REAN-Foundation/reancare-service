import express from 'express';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../common/api.error';
import { ResponseHandler } from '../../common/response.handler';
import { OrganizationService } from '../../services/organization.service';
import { Loader } from '../../startup/loader';
import { OrganizationValidator } from '../validators/organization.validator';
import { BaseController } from './base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class OrganizationController extends BaseController {

    //#region member variables and constructors

    _service: OrganizationService = null;

    _validator: OrganizationValidator = new OrganizationValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(OrganizationService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Organization.Create', request, response, false);

            const organizationDomainModel = await this._validator.create(request);

            const organization = await this._service.create(organizationDomainModel);
            if (organization == null) {
                throw new ApiError(400, 'Cannot create record for organization!');
            }

            ResponseHandler.success(request, response, 'Organization record created successfully!', 201, {
                Organization : organization,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Organization.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const organization = await this._service.getById(id);
            if (organization == null) {
                throw new ApiError(404, ' Organization record not found.');
            }

            ResponseHandler.success(request, response, 'Organization record retrieved successfully!', 200, {
                Organization : organization,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByContactUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Organization.GetByContactUserId', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const organization = await this._service.getByContactUserId(id);
            if (organization == null) {
                throw new ApiError(404, ' Organization record not found.');
            }

            ResponseHandler.success(request, response, 'Organization record retrieved successfully!', 200, {
                Organization : organization,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Organization.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} organization records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                OrganizationRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Organization.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Organization record not found.');
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
            await this.setContext('Organization.Delete', request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Organization record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Organization record cannot be deleted.');
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
            await this.setContext('Organization.AddAddress', request, response);

            const { id, addressId } = await this._validator.addOrRemoveAddress(request);
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
            await this.setContext('Organization.RemoveAddress', request, response);
            const { id, addressId } = await this._validator.addOrRemoveAddress(request);
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
            await this.setContext('Organization.GetAddress', request, response);
            const id: string = await this._validator.getParamId(request);

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
            await this.setContext('Organization.AddPerson', request, response);
            const { id, personId } = await this._validator.addOrRemovePerson(request);
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
            await this.setContext('Organization.RemovePerson', request, response);
            const { id, personId } = await this._validator.addOrRemovePerson(request);
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
            await this.setContext('Organization.GetPersons', request, response);
            const id: string = await this._validator.getParamId(request);
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
