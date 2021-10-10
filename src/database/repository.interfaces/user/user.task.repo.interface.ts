import { UserTaskDomainModel } from "../../../domain.types/user/user.task/user.task.domain.model";
import { UserTaskDto } from "../../../domain.types/user/user.task/user.task.dto";
import { UserTaskSearchFilters, UserTaskSearchResults } from "../../../domain.types/user/user.task/user.task.search.types";

export interface IUserTaskRepo {

    create(userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto>;

    getById(id: string): Promise<UserTaskDto>;

    search(filters: UserTaskSearchFilters): Promise<UserTaskSearchResults>;

    update(id: string, userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto>;

    delete(id: string): Promise<boolean>;

    startTask(id: string, userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto>;

    finishTask(id: string, userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto>;

    getTasksForTodaySummary (patientUserId: string): Promise<UserTaskSearchResults>;

}
