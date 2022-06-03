import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { CustomTaskService } from '../../../services/user/custom.task.service';
import { UserTaskService } from '../../../services/user/user.task.service';
import { CustomTaskValidator } from '../../validators/user/custom.task.validator';
import { Loader } from '../../../startup/loader';
import { UserTaskDomainModel } from '../../../domain.types/user/user.task/user.task.domain.model';
import { UserActionType } from '../../../domain.types/user/user.task/user.task.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomTaskController {

    //#region member variables and constructors

    _service: CustomTaskService = null;

    _userTaskService: UserTaskService = null;

    _authorizer: Authorizer = null;

    _validator: CustomTaskValidator = new CustomTaskValidator();

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

            const customTask = await this._service.create(domainModel);
            if (customTask == null) {
                throw new ApiError(400, 'Cannot create custom task!');
            }

            const userTaskModel: UserTaskDomainModel = {
                ActionId           : customTask.id,
                ActionType         : UserActionType.Custom,
                Task               : customTask.Task,
                Description        : customTask.Description,
                ScheduledStartTime : customTask.ScheduledStartTime,
                ScheduledEndTime   : customTask.ScheduledEndTime ?? null,
                Category           : customTask.Category
            };
            
            var userTask = await this._userTaskService.create(userTaskModel);
            userTask['Action'] = customTask;

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
                UserTask : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    //#endregion

}
