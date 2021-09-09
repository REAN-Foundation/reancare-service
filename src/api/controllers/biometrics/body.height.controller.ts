import express from 'express';

import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { Authorizer } from '../../../auth/authorizer';
import { PersonService } from '../../../services/person.service';

import { ApiError } from '../../../common/api.error';
import { BodyHeightValidator } from '../../validators/biometrics/body.height';
import { BodyHeightService } from '../../../services/biometrics/body.height.service';
import { RoleService } from '../../../services/role.service';
import { OrganizationService } from '../../../services/organization.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyHeightController {

    //#region member variables and constructors

    _service: BodyHeightService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _organizationService: OrganizationService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(BodyHeightService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._organizationService = Loader.container.resolve(OrganizationService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.Body.Height.Create";
            await this._authorizer.authorize(request, response);
            
            const domainModel = await BodyHeightValidator.create(request);

            const bodyHeight = await this._service.create(domainModel);
            if (bodyHeight == null) {
                throw new ApiError(400, 'Cannot create bodyHeight!');
            }

            ResponseHandler.success(request, response, 'BodyHeight created successfully!', 201, {
                Biometrices : { Body: { Height: bodyHeight } }
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.Body.Height.GetById";
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await BodyHeightValidator.getById(request);

            const bodyHeight = await this._service.getById(id);
            if (bodyHeight == null) {
                throw new ApiError(404, 'BodyHeight not found.');
            }

            ResponseHandler.success(request, response, 'BodyHeight retrieved successfully!', 200, {
                Biometrices : { Body: { Height: bodyHeight } }
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.Body.Height.Search";
            await this._authorizer.authorize(request, response);

            const filters = await BodyHeightValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} bodyHeight records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                Biometrices : { Body: { Height: { Items: searchResults.Items } } }
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.Body.Height.Update";
            await this._authorizer.authorize(request, response);

            const domainModel = await BodyHeightValidator.update(request);

            const id: string = await BodyHeightValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'BodyHeight not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update bodyHeight record!');
            }

            ResponseHandler.success(request, response, 'BodyHeight record updated successfully!', 200, {
                Biometrices : { Body: { Height: updated } }
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.Body.Height.Delete";
            await this._authorizer.authorize(request, response);

            const id: string = await BodyHeightValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'BodyHeight not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'BodyHeight cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'BodyHeight record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
