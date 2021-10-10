import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { OrganizationService } from '../../../services/organization.service';
import { PersonService } from '../../../services/person.service';
import { RoleService } from '../../../services/role.service';
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

    constructor() {
        this._service = Loader.container.resolve(UserTaskService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._organizationService = Loader.container.resolve(OrganizationService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await UserTaskValidator.create(request);

            const userTask = await this._service.create(domainModel);
            if (userTask == null) {
                throw new ApiError(400, 'Cannot create userTask!');
            }

            ResponseHandler.success(request, response, 'UserTask created successfully!', 201, {
                UserTask : userTask,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await UserTaskValidator.getById(request);

            const userTask = await this._service.getById(id);
            if (userTask == null) {
                throw new ApiError(404, 'UserTask not found.');
            }

            ResponseHandler.success(request, response, 'UserTask retrieved successfully!', 200, {
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

            const filters = await UserTaskValidator.search(request);

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

            const id: string = await UserTaskValidator.startTask(request);

            const existingUserTask = await this._service.getById(id);
            if (existingUserTask == null) {
                throw new ApiError(404, 'UserTask not found.');
            }

            const updated = await this._service.startTask(id, existingUserTask);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update userTask record!');
            }

            ResponseHandler.success(request, response, 'UserTask started successfully!', 200, {
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

            const id: string = await UserTaskValidator.finishTask(request);

            const existingUserTask = await this._service.getById(id);
            if (existingUserTask == null) {
                throw new ApiError(404, 'UserTask not found.');
            }

            const updated = await this._service.finishTask(id, existingUserTask);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update userTask record!');
            }

            ResponseHandler.success(request, response, 'UserTask finished successfully!', 200, {
                UserTask : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTasksForTodaySummary = async(request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.Summary';
            await this._authorizer.authorize(request, response);

            const patientUserId = await UserTaskValidator.getTasksForTodaySummary(request);

            const searchResults = await this._service.getTasksForTodaySummary(patientUserId);

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

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await UserTaskValidator.update(request);

            const id: string = await UserTaskValidator.getById(request);
            const existingUserTask = await this._service.getById(id);
            if (existingUserTask == null) {
                throw new ApiError(404, 'UserTask not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update userTask record!');
            }

            ResponseHandler.success(request, response, 'UserTask record updated successfully!', 200, {
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

            const id: string = await UserTaskValidator.getById(request);
            const existingUserTask = await this._service.getById(id);
            if (existingUserTask == null) {
                throw new ApiError(404, 'UserTask not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'UserTask cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'UserTask record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
