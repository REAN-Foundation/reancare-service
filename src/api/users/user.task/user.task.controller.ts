import express from 'express';
import { UserTaskDto } from '../../../domain.types/users/user.task/user.task.dto';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { Logger } from '../../../common/logger';
import { ResponseHandler } from '../../../common/response.handler';
import { UserActionType, UserActionTypeList, UserTaskCategoryList } from '../../../domain.types/users/user.task/user.task.types';
import { OrganizationService } from '../../../services/general/organization.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { UserActionResolver } from '../../../services/users/user/user.action.resolver';
import { UserTaskService } from '../../../services/users/user/user.task.service';
import { Loader } from '../../../startup/loader';
import { UserTaskValidator } from './user.task.validator';
import { MedicationConsumptionService } from '../../../services/clinical/medication/medication.consumption.service';
import { CareplanService } from '../../../services/clinical/careplan.service';
import { EHRAnalyticsHandler } from '../../../modules/ehr.analytics/ehr.analytics.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskController {

    //#region member variables and constructors

    _service: UserTaskService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _organizationService: OrganizationService = null;

    _medicationConsumptionService: MedicationConsumptionService = null;

    _careplanService: CareplanService = null;

    _authorizer: Authorizer = null;

    _validator: UserTaskValidator = new UserTaskValidator();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor() {
        this._service = Loader.container.resolve(UserTaskService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._organizationService = Loader.container.resolve(OrganizationService);
        this._medicationConsumptionService = Loader.container.resolve(MedicationConsumptionService);
        this._careplanService = Loader.container.resolve(CareplanService);
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
            request.context = 'UserTask.GetByDisplayId';

            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamStr(request, 'displayId');

            const userTask = await this._service.getByDisplayId(id);
            if (userTask == null) {
                throw new ApiError(404, 'User task not found.');
            }

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
            request.context = 'UserTask.Search';
            await this._authorizer.authorize(request, response);

            const filters = await this._validator.search(request);

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
            request.context = 'UserTask.StartTask';
            await this._authorizer.authorize(request, response);
            var actionResolver = new UserActionResolver();

            const id: string = await this._validator.getParamUuid(request, 'id');

            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'User task not found.');
            }

            if (existing.ActionId != null && existing.ActionType !== null) {

                const result = await actionResolver.startAction(
                    existing.ActionType, existing.ActionId);
                Logger.instance().log(`Starting ${existing.ActionType} - Action result : ${result.toString()}`);
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
            request.context = 'UserTask.FinishTask';
            await this._authorizer.authorize(request, response);
            var actionResolver = new UserActionResolver();

            const { id, finishedAt, userResponse } = await this._validator.finishTask(request);
            Logger.instance().log(`User Response: ${userResponse}`);

            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'User task not found.');
            }

            if (existing.ActionId != null && existing.ActionType !== null) {
                const result = await actionResolver.completeAction(
                    existing.ActionType, existing.ActionId, true, finishedAt);
                Logger.instance().log(`${existing.ActionType} - Action result : ${result}`);

                if (userResponse) {
                    await this._careplanService.updateActivityUserResponse(existing.ActionId, userResponse );
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

                var healthSystemHospitalDetails = await this._service.getHealthSystem(updated.UserId);
                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(action.PatientUserId);
                if (eligibleAppNames.length > 0) {
                    for (var appName of eligibleAppNames) {
                        this.addEHRRecord(action, appName, healthSystemHospitalDetails, updated);
                    }
                } else {
                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${action.PatientUserId}`);
                }

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
            request.context = 'UserTask.Update';
            await this._authorizer.authorize(request, response);
            var actionResolver = new UserActionResolver();

            const updateModel = await this._validator.update(request);
            const id: string = await this._validator.getParamUuid(request, 'id');

            const userTask = await this._service.getById(id);
            if (userTask == null) {
                throw new ApiError(404, 'User task not found.');
            }

            if (userTask.ActionId != null && userTask.ActionType !== null) {
                const updates = updateModel;
                await actionResolver.updateAction(userTask.ActionType, userTask.ActionId, updates);
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
            request.context = 'UserTask.CancelTask';
            await this._authorizer.authorize(request, response);
            var actionResolver = new UserActionResolver();

            const { id, reason } = await this._validator.cancelTask(request);

            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'User task not found.');
            }

            if (existing.ActionId != null && existing.ActionType !== null) {
                const result = await actionResolver.cancelAction(existing.ActionType, existing.ActionId);
                Logger.instance().log(`${existing.ActionType} - Action result : ${result.toString()}`);
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
            request.context = 'UserTask.SummaryForDay';
            await this._authorizer.authorize(request, response);

            const { userId, date } = await this._validator.getTaskSummaryForDay(request);
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

    deletePatientFutureTask = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserTask.DeleteFutureTask';
            await this._authorizer.authorize(request, response);

            const userId: string = await this._validator.getParamUuid(request, 'userId');
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

    private addEHRRecord = (action: any, appName?: string, healthSystemHospitalDetails?: any , updated?: UserTaskDto) => {
        EHRAnalyticsHandler.addCareplanActivityRecord(
            appName,
            action.PatientUserId,
            action.id,
            action.EnrollmentId,     
            action.Provider,               
            action.PlanName,      
            action.PlanCode,                
            action.Type,            
            action.Category,        
            action.ProviderActionId,
            action.Title,           
            action.Description,     
            action.Url,
            'English',       
            action.ScheduledAt,
            action.CompletedAt,     
            action.Sequence,        
            action.Frequency,       
            action.Status,
            healthSystemHospitalDetails.HealthSystem ? healthSystemHospitalDetails.HealthSystem : null,
            healthSystemHospitalDetails.AssociatedHospital ? healthSystemHospitalDetails.AssociatedHospital : null,
            updated.CreatedAt ? new Date(updated.CreatedAt) : null           
        );
};

    //#endregion

}
