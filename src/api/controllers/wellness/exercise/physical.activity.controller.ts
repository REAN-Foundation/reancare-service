import express from 'express';

import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { Loader } from '../../../../startup/loader';
import { Authorizer } from '../../../../auth/authorizer';
import { PersonService } from '../../../../services/person.service';

import { ApiError } from '../../../../common/api.error';
import { PhysicalActivityValidator } from '../../../validators/wellness/exercise/physical.activity.validator';
import { PhysicalActivityService } from '../../../../services/wellness/exercise/physical.activity.service';
import { RoleService } from '../../../../services/role.service';
import { UserService } from '../../../../services/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class PhysicalActivityController {

    //#region member variables and constructors

    _service: PhysicalActivityService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _userService: UserService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(PhysicalActivityService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._userService = Loader.container.resolve(UserService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PhysicalActivity.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await PhysicalActivityValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const physicalActivity = await this._service.create(domainModel);
            if (physicalActivity == null) {
                throw new ApiError(400, 'Cannot create physical activity!');
            }

            ResponseHandler.success(request, response, 'physical activity created successfully!', 201, {
                PhysicalActivity : physicalActivity,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PhysicalActivity.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await PhysicalActivityValidator.getById(request);

            const physicalActivity = await this._service.getById(id);
            if (physicalActivity == null) {
                throw new ApiError(404, 'Physical activity not found.');
            }

            ResponseHandler.success(request, response, 'Physical activity retrieved successfully!', 200, {
                PhysicalActivity : physicalActivity,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PhysicalActivity.Search';
            await this._authorizer.authorize(request, response);

            const filters = await PhysicalActivityValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Physical activity records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { PhysicalActivities: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PhysicalActivity.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await PhysicalActivityValidator.update(request);

            const id: string = await PhysicalActivityValidator.getById(request);
            const physicalActivity = await this._service.getById(id);
            if (physicalActivity == null) {
                throw new ApiError(404, 'physical activity not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update physical activity record!');
            }

            ResponseHandler.success(request, response, 'physical activity record updated successfully!', 200, {
                PhysicalActivity : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PhysicalActivity.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await PhysicalActivityValidator.getById(request);
            const physicalActivity = await this._service.getById(id);
            if (physicalActivity == null) {
                throw new ApiError(404, 'Physical activity not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Physical activity cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Physical activity record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
