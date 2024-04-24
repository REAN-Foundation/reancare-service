import express from 'express';
import { UserTaskDto } from '../../../domain.types/users/user.task/user.task.dto';
import { ApiError } from '../../../common/api.error';
import { Logger } from '../../../common/logger';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { UserActionType, UserActionTypeList, UserTaskCategoryList } from '../../../domain.types/users/user.task/user.task.types';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { UserActionResolver } from '../../../services/users/user/user.action.resolver';
import { UserTaskService } from '../../../services/users/user/user.task.service';
import { UserTaskValidator } from './user.task.validator';
import { MedicationConsumptionService } from '../../../services/clinical/medication/medication.consumption.service';
import { CareplanService } from '../../../services/clinical/careplan.service';
import { Injector } from '../../../startup/injector';
import { EHRUserTaskService } from '../../../modules/ehr.analytics/ehr.services/ehr.user.task.service';
import { BaseUserController } from '../base.user.controller';
import { UserTaskSearchFilters } from '../../../domain.types/users/user.task/user.task.search.types';
import { PermissionHandler } from '../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskController extends BaseUserController {

    //#region member variables and constructors

    _service: UserTaskService = Injector.Container.resolve(UserTaskService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _organizationService: OrganizationService = Injector.Container.resolve(OrganizationService);

    _medicationConsumptionService: MedicationConsumptionService = Injector.Container.resolve(MedicationConsumptionService);

    _careplanService: CareplanService = Injector.Container.resolve(CareplanService);

    _validator: UserTaskValidator = new UserTaskValidator();

    _ehrUserTaskService: EHRUserTaskService = Injector.Container.resolve(EHRUserTaskService);

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
            const model = await this._validator.create(request);
            await this.authorizeOne(request, model.UserId);
            const userTask = await this._service.create(model);
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
            const id: string = await this._validator.getParamUuid(request, 'id');

            const userTask = await this._service.getById(id);
            if (userTask == null) {
                throw new ApiError(404, 'User task not found.');
            }
            await this.authorizeOne(request, userTask.UserId);

            if (userTask.ActionId != null && userTask.ActionType !== null) {
                var actionResolver = new UserActionResolver();
                const action = await actionResolver.getAction(userTask.ActionType, userTask.ActionId);
                Logger.instance().log(JSON.stringify(action));
                if (action) {
                    userTask['Action'] = action;
                }

            }

            ResponseHandler.success(request, response, 'User task retrieved successfully!', 200, {
                UserTask : userTask,
            });
            Logger.instance().log(JSON.stringify(userTask));

        } catch (error) {
            Logger.instance().log(JSON.stringify(error));
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByDisplayId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await this._validator.getParamStr(request, 'displayId');

            const userTask = await this._service.getByDisplayId(id);
            if (userTask == null) {
                throw new ApiError(404, 'User task not found.');
            }
            await this.authorizeOne(request, userTask.UserId);

            if (userTask.ActionId != null && userTask.ActionType !== null) {
                var actionResolver = new UserActionResolver();
                const action = await actionResolver.getAction(userTask.ActionType, userTask.ActionId);
                if (action) {
                    userTask['Action'] = action;
                }
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
            let filters: UserTaskSearchFilters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);

            var searchResults = await this._service.search(filters);
            searchResults.Items = await this.updateDtos(searchResults.Items, false);
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
            var actionResolver = new UserActionResolver();

            const id: string = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'User task not found.');
            }
            await this.authorizeOne(request, record.UserId);

            if (record.ActionId != null && record.ActionType !== null) {

                const result = await actionResolver.startAction(
                    record.ActionType, record.ActionId);
                Logger.instance().log(`Starting ${record.ActionType} - Action result : ${result.toString()}`);
            }

            const updated = await this._service.startTask(id);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update user task record!');
            }

            if (updated.ActionId != null && updated.ActionType !== null) {
                const action = await actionResolver.getAction(updated.ActionType, updated.ActionId);
                if (action) {
                    updated['Action'] = action;
                }
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
            var actionResolver = new UserActionResolver();

            const { id, finishedAt, userResponse } = await this._validator.finishTask(request);
            Logger.instance().log(`User Response: ${userResponse}`);

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'User task not found.');
            }
            await this.authorizeOne(request, record.UserId);

            if (record.ActionId != null && record.ActionType !== null) {
                const result = await actionResolver.completeAction(
                    record.ActionType, record.ActionId, true, finishedAt);
                Logger.instance().log(`${record.ActionType} - Action result : ${result}`);

                if (userResponse) {
                    await this._careplanService.updateActivityUserResponse(record.ActionId, userResponse );
                }
            }

            const updated = await this._service.finishTask(id);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update user task record!');
            }

            if (updated.ActionId != null && updated.ActionType !== null) {
                const action = await actionResolver.getAction(updated.ActionType, updated.ActionId);
                if (action) {
                    updated['Action'] = action;
                }
                var healthSystem = await this._service.getHealthSystem(updated.UserId);
                await this._ehrUserTaskService.addEHRUserTaskForAppNames(updated, healthSystem);
            }

            ResponseHandler.success(request, response, 'User task finished successfully!', 200, {
                UserTask : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            var actionResolver = new UserActionResolver();

            const updateModel = await this._validator.update(request);
            const id: string = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'User task not found.');
            }
            await this.authorizeOne(request, record.UserId);

            if (record.ActionId != null && record.ActionType !== null) {
                const updates = updateModel;
                await actionResolver.updateAction(record.ActionType, record.ActionId, updates);
            }

            const updated = await this._service.update(id, updateModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update userTask record!');
            }

            if (updated.ActionId != null && updated.ActionType !== null) {
                const action = await actionResolver.getAction(updated.ActionType, updated.ActionId);
                if (action) {
                    updated['Action'] = action;
                }
            }

            ResponseHandler.success(request, response, 'User task record updated successfully!', 200, {
                UserTask : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    cancelTask = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            var actionResolver = new UserActionResolver();

            const { id, reason } = await this._validator.cancelTask(request);

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'User task not found.');
            }
            await this.authorizeOne(request, record.UserId);

            if (record.ActionId != null && record.ActionType !== null) {
                const result = await actionResolver.cancelAction(record.ActionType, record.ActionId);
                Logger.instance().log(`${record.ActionType} - Action result : ${result.toString()}`);
            }

            const updated = await this._service.cancelTask(id, reason);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update user task record!');
            }

            if (updated.ActionId != null && updated.ActionType !== null) {
                const action = await actionResolver.getAction(updated.ActionType, updated.ActionId);
                if (action) {
                    updated['Action'] = action;
                }
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
            const { userId, date } = await this._validator.getTaskSummaryForDay(request);
            await this.authorizeOne(request, userId);
            const summary = await this._service.getTaskSummaryForDay(userId, date);
            summary.CompletedTasks = await this.updateDtos(summary.CompletedTasks);
            summary.InProgressTasks = await this.updateDtos(summary.InProgressTasks);
            summary.PendingTasks = await this.updateDtos(summary.PendingTasks);

            ResponseHandler.success(request, response, 'User task cancelled successfully!', 200, {
                UserTaskSummaryForDay : summary
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'User task not found.');
            }
            await this.authorizeOne(request, record.UserId);

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

    deletePatientFutureTask = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: string = await this._validator.getParamUuid(request, 'userId');
            await this.authorizeOne(request, userId);
            const deletedUserTask = await this._service.getFutureTaskByUserId(userId);

            ResponseHandler.success(request, response, `Total ${deletedUserTask} user task record deleted successfully!`, 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private updateDtos = async (dtos: UserTaskDto[], fullDetails = true): Promise<UserTaskDto[]> => {
        var updatedDtos: UserTaskDto[] = [];
        for await (var dto of dtos) {
            const updated = await this.updateDto(dto, fullDetails);
            updatedDtos.push(updated);
        }
        return updatedDtos;
    };

    private updateDto = async (dto: UserTaskDto, fullDetails = true): Promise<UserTaskDto> => {

        if (dto == null) {
            return null;
        }

        if (dto.ActionId === null) {
            return dto;
        }

        if (dto.ActionType === UserActionType.Medication) {
            const actionDto = await this._medicationConsumptionService.getById(dto.ActionId);
            dto.Action = actionDto;
        }
        else if (dto.ActionType === UserActionType.Careplan) {
            if (fullDetails) {
                dto.Action = await this._careplanService.getAction(dto.ActionId);
            }
            else {
                dto.Action = await this._careplanService.getActivity(dto.ActionId);
            }
        }

        return dto;
    };

    //#endregion


    authorizeSearch = async (
        request: express.Request,
        searchFilters: UserTaskSearchFilters): Promise<UserTaskSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.UserId != null) {
            if (searchFilters.UserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.UserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.UserId = currentUser.UserId;
        }
        return searchFilters;
    };

}
