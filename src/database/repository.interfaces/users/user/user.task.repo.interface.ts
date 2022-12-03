import { UserTaskDomainModel } from "../../../../domain.types/users/user.task/user.task.domain.model";
import { TaskSummaryDto, UserTaskDto } from "../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskSearchFilters, UserTaskSearchResults } from "../../../../domain.types/users/user.task/user.task.search.types";

export interface IUserTaskRepo {

    create(userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto>;

    getById(id: string): Promise<UserTaskDto>;

    getByActionId(actionId: string): Promise<UserTaskDto>;

    getByDisplayId(displayId: string): Promise<UserTaskDto>;

    search(filters: UserTaskSearchFilters): Promise<UserTaskSearchResults>;

    update(id: string, model: UserTaskDomainModel): Promise<UserTaskDto>;

    delete(id: string): Promise<boolean>;

    startTask(id: string): Promise<UserTaskDto>;

    finishTask(id: string): Promise<UserTaskDto>;

    cancelTask(id: string, reason?: string): Promise<UserTaskDto>;

    getTaskSummaryForDay (userId: string, dateStr: string): Promise<TaskSummaryDto>;

    getTaskForUserWithAction (userId: string, actionId: string): Promise<UserTaskDto>;

    getTaskForUserWithAction (userId: string, actionId: string): Promise<UserTaskDto>;

    getStats(patientUserId: string, numMonths: number): Promise<any>;

    getUserEngagementStats(patientUserId: string, numMonths: number): Promise<any>;
}
