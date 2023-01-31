import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { CustomTaskService } from '../../../services/users/user/custom.task.service';
import { UserTaskService } from '../../../services/users/user/user.task.service';
import { CustomTaskValidator } from './custom.task.validator';
import { Loader } from '../../../startup/loader';
import { CommonActions } from '../../../custom/common/common.actions';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomTaskController {

    //#region member variables and constructors

    _service: CustomTaskService = null;

    _userTaskService: UserTaskService = null;

    _authorizer: Authorizer = null;

    _validator: CustomTaskValidator = new CustomTaskValidator();

    _customActions: CommonActions = new CommonActions();

    constructor() {
        this._service = Loader.container.resolve(CustomTaskService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'CustomTask.Create';
            await this._authorizer.authorize(request, response);

            const domainModel = await this._validator.create(request);

            var userTask = await this._customActions.createCustomTask(domainModel);

            ResponseHandler.success(request, response, 'Custom task created successfully!', 201, {
                UserTask : userTask,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'CustomTask.GetById';

            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');

            const task = await this._service.getById(id);
            if (task == null) {
                throw new ApiError(404, 'Custom task not found.');
            }

            var userTask = await this._userTaskService.getByActionId(task.id);
            userTask['Action'] = task;

            ResponseHandler.success(request, response, 'Custom task retrieved successfully!', 200, {
                UserTask : userTask,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'CustomTask.Update';
            await this._authorizer.authorize(request, response);

            const updateModel = await this._validator.update(request);
            const id: string = await this._validator.getParamUuid(request, 'id');

            const task = await this._service.getById(id);
            if (task == null) {
                throw new ApiError(404, 'Custom task not found.');
            }

            const updated = await this._service.update(id, updateModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update custom task record!');
            }

            var userTask = await this._userTaskService.getByActionId(task.id);
            userTask['Action'] = updated;

            ResponseHandler.success(request, response, 'Custom task record updated successfully!', 200, {
                UserTask : userTask,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
