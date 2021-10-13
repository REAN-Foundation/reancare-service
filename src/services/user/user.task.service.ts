import { inject, injectable } from "tsyringe";
import { Helper } from "../../common/helper";
import { IUserTaskRepo } from "../../database/repository.interfaces/user/user.task.repo.interface";
import { UserTaskDomainModel } from '../../domain.types/user/user.task/user.task.domain.model';
import { TaskSummaryDto, UserTaskDto } from '../../domain.types/user/user.task/user.task.dto';
import { UserTaskSearchFilters, UserTaskSearchResults } from '../../domain.types/user/user.task/user.task.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserTaskService {

    constructor(
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
    ) {}

    create = async (userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto> => {
        const displayId = Helper.generateDisplayId('TSK');
        userTaskDomainModel.DisplayId = displayId;
        return await this._userTaskRepo.create(userTaskDomainModel);
    };

    getById = async (id: string): Promise<UserTaskDto> => {
        return await this._userTaskRepo.getById(id);
    };

    getByDisplayId = async (id: string): Promise<UserTaskDto> => {
        return await this._userTaskRepo.getByDisplayId(id);
    };

    search = async (filters: UserTaskSearchFilters): Promise<UserTaskSearchResults> => {
        return await this._userTaskRepo.search(filters);
    };

    update = async (id: string, userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto> => {
        return await this._userTaskRepo.update(id, userTaskDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._userTaskRepo.delete(id);
    };

    startTask = async (id: string): Promise<UserTaskDto> => {
        return await this._userTaskRepo.startTask(id);
    }

    finishTask = async (id: string): Promise<UserTaskDto> => {
        return await this._userTaskRepo.finishTask(id);
    }

    cancelTask = async (id: string, reason?: string): Promise<UserTaskDto> => {
        return await this._userTaskRepo.cancelTask(id, reason ?? null);
    }

    getTaskSummaryForDay = async (userId: string, dateStr: string): Promise<TaskSummaryDto> => {
        return await this._userTaskRepo.getTaskSummaryForDay(userId, dateStr);
    }

}
