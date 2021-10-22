import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { OrganizationService } from '../../../../services/organization.service';
import { PersonService } from '../../../../services/person.service';
import { RoleService } from '../../../../services/role.service';
import { HeartPointsService } from '../../../../services/wellness/daily.records/heart.points.service';
import { Loader } from '../../../../startup/loader';
import { HeartPointValidator } from '../../../validators/wellness/daily.records/heart.points.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class HeartPointController {

    //#region member variables and constructors

    _service: HeartPointsService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _organizationService: OrganizationService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(HeartPointsService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._organizationService = Loader.container.resolve(OrganizationService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HeartPoints.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await HeartPointValidator.create(request);

            if (domainModel.PersonId != null) {
                const person = await this._personService.getById(domainModel.PersonId);
                if (person == null) {
                    throw new ApiError(404, `Person with an id ${domainModel.PersonId} cannot be found.`);
                }
            }

            const heartPoint = await this._service.create(domainModel);
            if (heartPoint == null) {
                throw new ApiError(400, 'Cannot create heartPoint!');
            }

            ResponseHandler.success(request, response, 'HeartPoints created successfully!', 201, {
                HeartPoints : heartPoint,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HeartPoints.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await HeartPointValidator.getById(request);

            const heartPoint = await this._service.getById(id);
            if (heartPoint == null) {
                throw new ApiError(404, 'HeartPoints not found.');
            }

            ResponseHandler.success(request, response, 'HeartPoints retrieved successfully!', 200, {
                HeartPoints : heartPoint,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HeartPoints.Search';
            await this._authorizer.authorize(request, response);

            const filters = await HeartPointValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} heartPoint records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { HeartPoints: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HeartPoints.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await HeartPointValidator.update(request);

            const id: string = await HeartPointValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'HeartPoints not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update heartPoint record!');
            }

            ResponseHandler.success(request, response, 'HeartPoints record updated successfully!', 200, {
                HeartPoints : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'HeartPoints.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await HeartPointValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'HeartPoints not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'HeartPoints cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'HeartPoints record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
