import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { CustomTaskService } from '../../../services/users/user/custom.task.service';
import { UserTaskService } from '../../../services/users/user/user.task.service';
import { CustomTaskValidator } from './custom.task.validator';
import { CommonActions } from '../../../custom/common/common.actions';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomTaskController extends BaseController {

    //#region member variables and constructors

    _service: CustomTaskService = Injector.Container.resolve(CustomTaskService);

    _userTaskService: UserTaskService = Injector.Container.resolve(UserTaskService);

    _validator: CustomTaskValidator = new CustomTaskValidator();

    _customActions: CommonActions = new CommonActions();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);
            await this.authorizeOne(request, model.UserId);
            const userTask = await this._customActions.createCustomTask(model);
            ResponseHandler.success(request, response, 'Custom task created successfully!', 201, {
                UserTask : userTask,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await this._validator.getParamUuid(request, 'id');
            const task = await this._service.getById(id);
            if (task == null) {
                throw new ApiError(404, 'Custom task not found.');
            }
            await this.authorizeOne(request, task.UserId);
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
            const updateModel = await this._validator.update(request);
            const id: string = await this._validator.getParamUuid(request, 'id');

            const task = await this._service.getById(id);
            if (task == null) {
                throw new ApiError(404, 'Custom task not found.');
            }
            await this.authorizeOne(request, task.UserId);
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
