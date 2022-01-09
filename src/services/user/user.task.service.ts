import { inject, injectable } from "tsyringe";
import { Helper } from "../../common/helper";
import { IMedicationConsumptionRepo } from "../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IUserTaskRepo } from "../../database/repository.interfaces/user/user.task.repo.interface";
import { UserActionType } from "../../domain.types/user/user.task/user.task.types";
import { UserTaskDomainModel } from '../../domain.types/user/user.task/user.task.domain.model';
import { TaskSummaryDto, UserTaskDto } from '../../domain.types/user/user.task/user.task.dto';
import { UserTaskSearchFilters, UserTaskSearchResults } from '../../domain.types/user/user.task/user.task.search.types';
import { ICareplanRepo } from "../../database/repository.interfaces/careplan/careplan.repo.interface";
import { CareplanHandler } from '../../modules/careplan/careplan.handler';
import { Logger } from "../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserTaskService {

    _careplanHandler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
    ) {}

    create = async (userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto> => {
        const displayId = Helper.generateDisplayId('TSK');
        userTaskDomainModel.DisplayId = displayId;
        var dto = await this._userTaskRepo.create(userTaskDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    getById = async (id: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.getById(id);
        dto = await this.updateDto(dto, true);
        return dto;
    };

    getByDisplayId = async (id: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.getByDisplayId(id);
        dto = await this.updateDto(dto);
        return dto;
    };

    search = async (filters: UserTaskSearchFilters): Promise<UserTaskSearchResults> => {
        var items = [];
        var results = await this._userTaskRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    update = async (id: string, userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto> => {

        var dto = await this._userTaskRepo.update(id, userTaskDomainModel);

        if (dto.ActionType === UserActionType.Careplan && dto.ActionId !== null) {

            var activity = await this._careplanRepo.updateActivity(dto.ActionId, dto.Status, dto.FinishedAt);

            var updateBody = {
                CompletedAt : activity.CompletedAt,
                Status      : activity.Status,
            };

            var details = await this._careplanHandler.updateActivity(activity.PatientUserId,
                activity.Provider, activity.PlanCode, activity.EnrollmentId,
                activity.ProviderActionId, updateBody);
            
            Logger.instance().log(JSON.stringify(details, null, 2));
        }
        dto = await this.updateDto(dto);
        return dto;
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._userTaskRepo.delete(id);
    };

    startTask = async (id: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.startTask(id);
        dto = await this.updateDto(dto);
        return dto;
    }

    finishTask = async (id: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.finishTask(id);
        dto = await this.updateDto(dto);
        return dto;
    }

    cancelTask = async (id: string, reason?: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.cancelTask(id, reason ?? null);
        dto = await this.updateDto(dto);
        return dto;
    }

    getTaskSummaryForDay = async (userId: string, dateStr: string): Promise<TaskSummaryDto> => {
        var summaryDto = await this._userTaskRepo.getTaskSummaryForDay(userId, dateStr);
        summaryDto.CompletedTasks = await this.updateDtos(summaryDto.CompletedTasks);
        summaryDto.InProgressTasks = await this.updateDtos(summaryDto.InProgressTasks);
        summaryDto.PendingTasks = await this.updateDtos(summaryDto.PendingTasks);
        return summaryDto;
    }

    private updateDtos = async (dtos: UserTaskDto[]): Promise<UserTaskDto[]> => {
        var updatedDtos: UserTaskDto[] = [];
        for await (var dto of dtos) {
            dto = await this.updateDto(dto);
            updatedDtos.push(dto);
        }
        return updatedDtos;
    }

    private updateDto = async (dto: UserTaskDto, addDetails?: boolean): Promise<UserTaskDto> => {

        if (dto == null) {
            return null;
        }
        
        var actionDto: any = null;

        if (dto.ActionType === UserActionType.Medication &&
            dto.ActionId !== null) {
            actionDto = await this._medicationConsumptionRepo.getById(dto.ActionId);
            dto.Action = actionDto;
        }
        else if (dto.ActionType === UserActionType.Careplan && dto.ActionId !== null) {
            var activity = await this._careplanRepo.getActivity(dto.ActionId);
            if (addDetails) {
                var scheduledAt = activity.ScheduledAt ? activity.ScheduledAt.toISOString().split('T')[0] : null;
                const details = await this._careplanHandler.getActivity(
                    activity.PatientUserId,
                    activity.Provider,
                    activity.PlanCode,
                    activity.EnrollmentId,
                    activity.ProviderActionId,
                    scheduledAt);
                if (details) {
                    activity['Details'] = details;
                }
            }

            dto.Action = activity;
        
            return dto;
        }

    }

}
