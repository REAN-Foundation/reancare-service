import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BodyHeightService } from '../../../../services/clinical/biometrics/body.height.service';
import { OrganizationService } from '../../../../services/organization.service';
import { PersonService } from '../../../../services/person.service';
import { RoleService } from '../../../../services/role.service';
import { Loader } from '../../../../startup/loader';
import { BodyHeightValidator } from '../../../validators/clinical/biometrics/body.height.validator';

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
            request.context = "Biometrics.BodyHeight.Create";
            await this._authorizer.authorize(request, response);
            
            const domainModel = await BodyHeightValidator.create(request);

            const bodyHeight = await this._service.create(domainModel);
            if (bodyHeight == null) {
                throw new ApiError(400, 'Cannot create record for height!');
            }

            ResponseHandler.success(request, response, 'Height record created successfully!', 201, {
                BodyHeight : bodyHeight
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.GetById";
            
            await this._authorizer.authorize(request, response);

            const id: string = await BodyHeightValidator.getById(request);

            const bodyHeight = await this._service.getById(id);
            if (bodyHeight == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            ResponseHandler.success(request, response, 'Height record retrieved successfully!', 200, {
                BodyHeight : bodyHeight
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.Search";
            await this._authorizer.authorize(request, response);

            const filters = await BodyHeightValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} height records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                BodyHeightRecords : searchResults
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.Update";
            await this._authorizer.authorize(request, response);

            const domainModel = await BodyHeightValidator.update(request);

            const id: string = await BodyHeightValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update height record!');
            }

            ResponseHandler.success(request, response, 'Height record updated successfully!', 200, {
                BodyHeight : updated
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.Delete";
            await this._authorizer.authorize(request, response);

            const id: string = await BodyHeightValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Height record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Height record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
