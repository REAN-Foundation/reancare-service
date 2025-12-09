import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { Injector } from "../../../../../startup/injector";
import { CareplanService } from "../../../../clinical/careplan.service";
import { UserActionType } from "../../../../../domain.types/users/user.task/user.task.types";
import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { IUserTaskActionHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.action.handler.interface";
import { ICareplanRepo } from "../../../../../database/repository.interfaces/clinical/careplan.repo.interface";
import { UserTaskMessageDto } from "../../../../../domain.types/users/user.task/user.task.dto";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class CareplanActionHandler implements IUserTaskActionHandler {

    private _careplanService: CareplanService = Injector.Container.resolve(CareplanService);
    private _careplanRepo: ICareplanRepo = Injector.Container.resolve('ICareplanRepo');

    async resolveAction(actionType: UserActionType, actionId: uuid): Promise<UserTaskActionData> {
        try {

            const actionData = await this._careplanService.getAction(actionId);

            if (!actionData) {
                Logger.instance().log(`No careplan activity found for ID: ${actionId}`);
                return null;
            }

            return actionData as UserTaskActionData;

        } catch (error) {
            Logger.instance().log(`Error resolving careplan action for activity ${actionId}: ${error}`);
            throw error;
        }
    }

    async onTaskCompleted(taskId: uuid, actionId: uuid): Promise<void> {
        try {
            await this._careplanRepo.completeActivity(actionId);
            Logger.instance().log(`Careplan activity ${actionId} completed for task ${taskId}`);
        } catch (error) {
            Logger.instance().log(`Error completing careplan activity ${actionId} for task ${taskId}: ${error}`);
            throw error;
        }
    }

    async enrichTaskMetadata(userTask: UserTaskMessageDto): Promise<void> {
        try {
            if (!userTask.ActionId) {
                userTask.Sequence = 0;
                return;
            }

            const activity = await this._careplanRepo.getActivity(userTask.ActionId);
            userTask.Sequence = activity?.Sequence ?? 0;
            userTask.Language = activity?.Language ?? 'en';

        } catch (error) {
            Logger.instance().log(`Error enriching careplan task metadata for task ${userTask.id}: ${error}`);
            userTask.Sequence = 0;
        }
    }

}

