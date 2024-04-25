import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { OrganizationValidator } from './organization.validator';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import { OrganizationDomainModel, OrganizationSearchFilters } from '../../../domain.types/general/organization/organization.types';
import { PermissionHandler } from '../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class OrganizationController extends BaseController {

    //#region member variables and constructors

    _service: OrganizationService = Injector.Container.resolve(OrganizationService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _validator: OrganizationValidator = new OrganizationValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: OrganizationDomainModel = await this._validator.create(request);

            if (model.ParentOrganizationId != null) {
                const person = await this._service.getById(model.ParentOrganizationId);
                if (person == null) {
                    throw new ApiError(404, `Parent organization with an id ${model.ParentOrganizationId} cannot be found.`);
                }
            }

            await this.authorizeOne(request, model.ContactUserId, model.TenantId);

            const organization = await this._service.create(model);
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
            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            await this.authorizeOne(request, record.ContactUserId, record.TenantId);

            ResponseHandler.success(request, response, 'Organization retrieved successfully!', 200, {
                Organization : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByContactUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const contactUserId: uuid = await this._validator.getParamUuid(request, 'id');

            const records = await this._service.getByContactUserId(contactUserId);
            if (records == null) {
                throw new ApiError(404, 'Organization not found.');
            }
            const count = records.length;
            if (count > 0) {
                await this.authorizeOne(request, records[0].ContactUserId, records[0].TenantId);
            }

            ResponseHandler.success(request, response, 'Organization retrieved successfully!', 200, {
                Organization : records,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
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
            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            await this.authorizeOne(request, record.ContactUserId, record.TenantId);

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
            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }

            await this.authorizeOne(request, record.ContactUserId, record.TenantId);

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
            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const addressId: uuid = await this._validator.getParamUuid(request, 'addressId');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }
            await this.authorizeOne(request, record.ContactUserId, record.TenantId);

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
            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const addressId: uuid = await this._validator.getParamUuid(request, 'addressId');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }
            await this.authorizeOne(request, record.ContactUserId, record.TenantId);

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
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }
            await this.authorizeOne(request, record.ContactUserId, record.TenantId);
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
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const personId: uuid = await this._validator.getParamUuid(request, 'personId');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }
            await this.authorizeOne(request, record.ContactUserId, record.TenantId);

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
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const personId: uuid = await this._validator.getParamUuid(request, 'personId');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }
            await this.authorizeOne(request, record.ContactUserId, record.TenantId);

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
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Organization not found.');
            }
            await this.authorizeOne(request, record.ContactUserId, record.TenantId);
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

    authorizeSearch = async (
        request: express.Request,
        searchFilters: OrganizationSearchFilters): Promise<OrganizationSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.ContactUserId != null) {
            if (searchFilters.ContactUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.ContactUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.ContactUserId = currentUser.UserId;
        }
        return searchFilters;
    };

}
