import { inject, injectable } from "tsyringe";
import { Helper } from "../../common/helper";
import { IMedicationConsumptionRepo } from "../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IUserTaskRepo } from "../../database/repository.interfaces/user/user.task.repo.interface";
import { UserTaskDomainModel } from '../../domain.types/user/user.task/user.task.domain.model';
import { TaskSummaryDto, UserTaskDto } from '../../domain.types/user/user.task/user.task.dto';
import { UserTaskSearchFilters, UserTaskSearchResults } from '../../domain.types/user/user.task/user.task.search.types';
import { ICareplanRepo } from "../../database/repository.interfaces/clinical/careplan.repo.interface";
import { CareplanHandler } from '../../modules/careplan/careplan.handler';
import { UserActionType } from "../../domain.types/user/user.task/user.task.types";

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
        return dto;
    };

    getById = async (id: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.getById(id);
        return dto;
    };

    getByDisplayId = async (id: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.getByDisplayId(id);
        return dto;
    };

    search = async (filters: UserTaskSearchFilters): Promise<UserTaskSearchResults> => {
        var items = [];
        var results = await this._userTaskRepo.search(filters);
        for await (var dto of results.Items) {
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    update = async (id: string, updateModel: UserTaskDomainModel): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.update(id, updateModel);
        return dto;
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._userTaskRepo.delete(id);
    };

    startTask = async (id: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.startTask(id);
        return dto;
    };

    finishTask = async (id: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.finishTask(id);
        return dto;
    };

    cancelTask = async (id: string, reason?: string): Promise<UserTaskDto> => {
        var dto = await this._userTaskRepo.cancelTask(id, reason ?? null);
        return dto;
    };

    getTaskSummaryForDay = async (userId: string, dateStr: string): Promise<TaskSummaryDto> => {
        var summaryDto = await this._userTaskRepo.getTaskSummaryForDay(userId, dateStr);
        summaryDto.CompletedTasks = await this.updateDtos(summaryDto.CompletedTasks);
        summaryDto.InProgressTasks = await this.updateDtos(summaryDto.InProgressTasks);
        summaryDto.PendingTasks = await this.updateDtos(summaryDto.PendingTasks);
        return summaryDto;
    };

    private updateDtos = async (dtos: UserTaskDto[]): Promise<UserTaskDto[]> => {
        var updatedDtos: UserTaskDto[] = [];
        for await (var dto of dtos) {
            dto = await this.updateDto(dto);
            updatedDtos.push(dto);
        }
        return updatedDtos;
    };

    private updateDto = async (dto: UserTaskDto): Promise<UserTaskDto> => {

        if (dto == null) {
            return null;
        }
        
        var actionDto: any = null;
        if (dto.ActionType === UserActionType.Medication &&
            dto.ActionId !== null) {
            actionDto = await this._medicationConsumptionRepo.getById(dto.ActionId);
            dto.Action = actionDto;
        }
        // else if (dto.ActionType === UserActionType.Careplan) {

        // }
        
        return dto;
    };

}
