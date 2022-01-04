import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { Logger } from '../../../common/logger';
import { ResponseHandler } from '../../../common/response.handler';
import { UserActionTypeList, UserTaskCategoryList } from '../../../domain.types/user/user.task/user.task..types';
import { OrganizationService } from '../../../services/organization.service';
import { PersonService } from '../../../services/person.service';
import { RoleService } from '../../../services/role.service';
import { UserActionResolver } from '../../../services/user/user.action.resolver';
import { UserTaskService } from '../../../services/user/user.task.service';
import { Loader } from '../../../startup/loader';
import { UserTaskValidator } from '../../validators/user/user.task.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskController {

    //#region member variables and constructors

    _service: UserTaskService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _organizationService: OrganizationService = null;

    _authorizer: Authorizer = null;

    _validator: UserTaskValidator = new UserTaskValidator();

    constructor() {
        this._service = Loader.container.resolve(UserTaskService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._organizationService = Loader.container.resolve(OrganizationService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    getCategories = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'User task categories retrieved successfully!', 200, {
                UserTaskCategories : UserTaskCategoryList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUserActionTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'User action types retrieved successfully!', 200, {
                UserActionTypes : UserActionTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await this._validator.create(request);

            const userTask = await this._service.create(domainModel);
            if (userTask == null) {
                throw new ApiError(400, 'Cannot create userTask!');
            }

            ResponseHandler.success(request, response, 'User task created successfully!', 201, {
                UserTask : userTask,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');

            const userTask = await this._service.getById(id);
            if (userTask == null) {
                throw new ApiError(404, 'User task not found.');
            }

            ResponseHandler.success(request, response, 'User task retrieved successfully!', 200, {
                UserTask : userTask,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByDisplayId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.GetByDisplayId';
            
            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamStr(request, 'displayId');

            const userTask = await this._service.getByDisplayId(id);
            if (userTask == null) {
                throw new ApiError(404, 'User task not found.');
            }

            ResponseHandler.success(request, response, 'User task retrieved successfully!', 200, {
                UserTask : userTask,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.Search';
            await this._authorizer.authorize(request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} userTask records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { UserTasks: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    startTask = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.StartTask';
            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');

            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'User task not found.');
            }

            const updated = await this._service.startTask(id);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update user task record!');
            }

            ResponseHandler.success(request, response, 'User task started successfully!', 200, {
                UserTask : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    finishTask = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.FinishTask';
            await this._authorizer.authorize(request, response);

            const { id, finishedAt, comments } = await this._validator.finishTask(request);

            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'User task not found.');
            }

            const updated = await this._service.finishTask(id);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update user task record!');
            }

            if (updated.ActionId != null && updated.ActionType !== null) {
                var actionResolver = new UserActionResolver();
                const result = await actionResolver.completeAction(
                    updated.ActionType, updated.ActionId, true, finishedAt);
                Logger.instance().log(`${updated.ActionType} - Action result : ${result.toString()}`);
            }
            
            ResponseHandler.success(request, response, 'User task finished successfully!', 200, {
                UserTask : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    cancelTask = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.CancelTask';
            await this._authorizer.authorize(request, response);

            const { id, reason } = await this._validator.cancelTask(request);
            
            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'User task not found.');
            }

            const updated = await this._service.cancelTask(id, reason);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update user task record!');
            }

            if (updated.ActionId != null && updated.ActionType !== null) {
                var actionResolver = new UserActionResolver();
                const result = await actionResolver.cancelAction(updated.ActionType, updated.ActionId);
                Logger.instance().log(`${updated.ActionType} - Action result : ${result.toString()}`);
            }

            ResponseHandler.success(request, response, 'User task cancelled successfully!', 200, {
                UserTask : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTaskSummaryForDay = async(request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.SummaryForDay';
            await this._authorizer.authorize(request, response);

            const { userId, date } = await this._validator.getTaskSummaryForDay(request);
            const summary = await this._service.getTaskSummaryForDay(userId, date);
                   
            ResponseHandler.success(request, response, 'User task cancelled successfully!', 200, {
                UserTaskSummaryForDay : summary
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await this._validator.update(request);
            const id: string = await this._validator.getParamUuid(request, 'id');
            
            const existingUserTask = await this._service.getById(id);
            if (existingUserTask == null) {
                throw new ApiError(404, 'User task not found.');
            }

            const updated = await this._service.update(id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update userTask record!');
            }

            ResponseHandler.success(request, response, 'User task record updated successfully!', 200, {
                UserTask : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            const existingUserTask = await this._service.getById(id);
            if (existingUserTask == null) {
                throw new ApiError(404, 'User task not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'User task cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'User task record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
