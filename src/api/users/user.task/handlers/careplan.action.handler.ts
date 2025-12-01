import { injectable } from "tsyringe";
import { Logger } from "../../../../common/logger";
import { Injector } from "../../../../startup/injector";
import { ICareplanRepo } from "../../../../database/repository.interfaces/clinical/careplan.repo.interface";
import { CareplanService } from "../../../../services/clinical/careplan.service";
import { UserActionType } from "../../../../domain.types/users/user.task/user.task.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { UserTaskActionData } from "../../../../domain.types/users/user.task/resolved.action.data.types";
import { IUserTaskActionHandler } from "../../../../database/repository.interfaces/users/user/task/user.task.action.handler.interface";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class CareplanActionHandler implements IUserTaskActionHandler {
    
    private _careplanService: CareplanService = Injector.Container.resolve(CareplanService);
    private _careplanRepo: ICareplanRepo = Injector.Container.resolve('ICareplanRepo');

    async resolveAction(actionType: UserActionType, actionId: uuid): Promise<UserTaskActionData> {
        try {
            if (!actionId || actionType !== UserActionType.Careplan) {
                Logger.instance().log(`Skipping careplan action resolution - ActionId or ActionType is invalid`);
                return null;
            }

            Logger.instance().log(`Resolving careplan action for activity: ${actionId}`);
            
            const actionData = await this._careplanService.getAction(actionId);
            
            if (!actionData) {
                Logger.instance().log(`No careplan activity found for ID: ${actionId}`);
                return null;
            }

            Logger.instance().log(`Careplan action resolved successfully for activity: ${actionId}`);
            return actionData as UserTaskActionData;

        } catch (error) {
            Logger.instance().log(`Error resolving careplan action for activity ${actionId}: ${error}`);
            throw error;
        }
    }
}

