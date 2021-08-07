import express from 'express';

import { Helper } from '../../common/helper';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { PersonService } from '../../services/person.service';

import { ApiError } from '../../common/api.error';
import { OrganizationValidator } from '../validators/organization.validator';
import { OrganizationService } from '../../services/organization.service';
import { RoleService } from '../../services/role.service';

///////////////////////////////////////////////////////////////////////////////////////

export class OrganizationController {

    //#region member variables and constructors

    _service: OrganizationService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _authorizer: Authorizer = null;

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

            const domainModel = await OrganizationValidator.create(request);

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
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await OrganizationValidator.getById(request);

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
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const contactUserId: string = await OrganizationValidator.getByContactUserId(request);

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

            const filters = await OrganizationValidator.search(request);

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

            const domainModel = await OrganizationValidator.update(request);

            const id: string = await OrganizationValidator.getById(request);
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

            const id: string = await OrganizationValidator.getById(request);
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

    //#endregion

}
