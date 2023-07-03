import { inject, injectable } from "tsyringe";
import { ICustomTaskRepo } from "../../../database/repository.interfaces/users/user/custom.task.repo.interface";
import { CustomTaskDto } from '../../../domain.types/users/custom.task/custom.task.dto';
import { IUserActionService } from "./user.action.service.interface";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { CustomTaskDomainModel } from "../../../domain.types/users/custom.task/custom.task.domain.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CustomTaskService implements IUserActionService {

    constructor(
        @inject('ICustomTaskRepo') private _customTaskRepo: ICustomTaskRepo,
    ) {}

    getAction = async (actionId: uuid): Promise<any> => {
        return await this._customTaskRepo.getById(actionId);
    };

    startAction = async (actionId: uuid): Promise<boolean> => {
        const task = await this._customTaskRepo.startTask(actionId);
        return task != null;
    };

    completeAction = async (
        actionId: uuid,
        completionTime?: Date,
        success?: boolean,
        actionDetails?: any): Promise<boolean> => {
        const task = await this._customTaskRepo.finishTask(actionId, completionTime, success, actionDetails);
        return task != null;
    };

    cancelAction = async (
        actionId: string,
        cancellationTime?: Date,
        cancellationReason?: string): Promise<boolean> => {
        const task = await this._customTaskRepo.cancelTask(actionId, cancellationTime, cancellationReason);
        return task != null;
    };

    updateAction = async (actionId: uuid, updates: any): Promise<any> => {
        const updateModel: CustomTaskDomainModel = updates as CustomTaskDomainModel;
        const task = await this._customTaskRepo.update(actionId, updateModel);
        return task != null;
    };

    create = async (model: CustomTaskDomainModel): Promise<CustomTaskDto> => {
        return await this._customTaskRepo.create(model);
    };

    getById = async (id: string): Promise<CustomTaskDto> => {
        return await this._customTaskRepo.getById(id);
    };

    update = async (id: string, updateModel: CustomTaskDomainModel): Promise<CustomTaskDto> => {
        return await this._customTaskRepo.update(id, updateModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._customTaskRepo.delete(id);
    };

}
