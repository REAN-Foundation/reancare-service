import { CustomTaskDto } from "../../../../domain.types/users/custom.task/custom.task.dto";
import { CustomTaskDomainModel } from "../../../../domain.types/users/custom.task/custom.task.domain.model";

export interface ICustomTaskRepo {

    create(userTaskDomainModel: CustomTaskDomainModel): Promise<CustomTaskDto>;

    getById(id: string): Promise<CustomTaskDto>;

    getByActionId(actionId: string): Promise<CustomTaskDto>;

    update(id: string, model: CustomTaskDomainModel): Promise<CustomTaskDto>;

    delete(id: string): Promise<boolean>;

    startTask(id: string): Promise<CustomTaskDto>;

    finishTask(id: string, completionTime?: Date, success?: boolean, details?: any): Promise<CustomTaskDto>;

    cancelTask(id: string, cancellationTime?: Date, reason?: string): Promise<CustomTaskDto>;

}
