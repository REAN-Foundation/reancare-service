import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../base.controller';
import { UserService } from '../../../services/user/user.service';
import { HealthPriorityValidator } from '../../validators/health.priority/health.priority.validator';
import { HealthPriorityService } from '../../../services/health.priority/health.priority.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthPriorityController extends BaseController {

    //#region member variables and constructors
    _service: HealthPriorityService = null;

    _userService: UserService = null;

    _validator: HealthPriorityValidator = new HealthPriorityValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(HealthPriorityService);
        this._userService = Loader.container.resolve(UserService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('HealthPriority.Create', request, response);

            const model = await this._validator.create(request);
            const healthPriority = await this._service.create(model);
            if (healthPriority == null) {
                throw new ApiError(400, 'Cannot create record for health priority!');
            }

            ResponseHandler.success(request, response, 'health priority record created successfully!', 201, {
                HealthPriority : healthPriority,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientHealthPriorities = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('HealthPriority.GetPatientHealthPriorities', request, response);

            const patientUserId:uuid = await this._validator.getParamUuid(request, 'patientUserId');

            const priorities = await this._service.getPatientHealthPriorities(patientUserId);
            if (priorities == null) {
                throw new ApiError(400, 'Cannot fetch priorities for given patient!');
            }

            ResponseHandler.success(request, response, 'Fetching priorities for given patient done successfully!', 200, {
                Priorities : priorities,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getPriorityTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('HealthPriority.GetPriorityTypes', request, response);

            const priorityTypes = await this._service.getPriorityTypes();
            if (priorityTypes.length === 0) {
                throw new ApiError(400, 'Cannot fetch priorities types!');
            }

            ResponseHandler.success(request, response, 'Fetched priority types successfully!', 200, {
                PriorityTypes : priorityTypes,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
