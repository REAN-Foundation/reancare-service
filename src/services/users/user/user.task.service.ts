import { inject, injectable } from "tsyringe";
import { Helper } from "../../../common/helper";
import { IMedicationConsumptionRepo } from "../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IUserTaskRepo } from "../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { UserTaskDomainModel } from '../../../domain.types/users/user.task/user.task.domain.model';
import { TaskSummaryDto, UserTaskDto } from '../../../domain.types/users/user.task/user.task.dto';
import { UserTaskSearchFilters, UserTaskSearchResults } from '../../../domain.types/users/user.task/user.task.search.types';
import { ICareplanRepo } from "../../../database/repository.interfaces/clinical/careplan.repo.interface";
import { CareplanHandler } from '../../../modules/careplan/careplan.handler';
import { PatientDetailsDto } from "../../../domain.types/users/patient/patient/patient.dto";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserTaskService {

    _careplanHandler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
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

    getByActionId = async (actionId: string): Promise<UserTaskDto> => {
        return await this._userTaskRepo.getByActionId(actionId);
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
        return summaryDto;
    };

    getFutureTaskByUserId = async (userId: string): Promise<number> => {
        const careplanActivity = {
            PatientUserId : userId
        };
        var dto = await this._careplanRepo.deleteFutureCareplanTask(careplanActivity);
        return dto;
    };

    getHealthSystem = async (id: string): Promise<PatientDetailsDto> => {
        var details = await this._patientRepo.getByUserId(id);
        return details;
    };

}
