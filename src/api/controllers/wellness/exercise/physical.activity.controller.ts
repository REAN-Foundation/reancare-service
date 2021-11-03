import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { UserService } from '../../../../services/user/user.service';
import { PhysicalActivityService } from '../../../../services/wellness/exercise/physical.activity.service';
import { Loader } from '../../../../startup/loader';
import { PhysicalActivityValidator } from '../../../validators/wellness/exercise/physical.activity.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class PhysicalActivityController extends BaseController {

    //#region member variables and constructors

    _service: PhysicalActivityService = null;

    _validator: PhysicalActivityValidator = new PhysicalActivityValidator();

    _userService: UserService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(PhysicalActivityService);
        this._userService = Loader.container.resolve(UserService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('PhysicalActivity.Create', request, response);
            
            const domainModel = await this._validator.create(request);

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
            this.setContext('PhysicalActivity.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

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
            this.setContext('PhysicalActivity.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
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
            this.setContext('PhysicalActivity.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const physicalActivity = await this._service.getById(id);
            if (physicalActivity == null) {
                throw new ApiError(404, 'Physical activity not found.');
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
            this.setContext('PhysicalActivity.Delete', request, response);
            
            const id: uuid = await this._validator.getParamUuid(request, 'id');
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
