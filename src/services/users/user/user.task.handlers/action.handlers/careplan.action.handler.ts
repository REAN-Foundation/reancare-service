import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { Injector } from "../../../../../startup/injector";
import { CareplanService } from "../../../../clinical/careplan.service";
import { UserActionType } from "../../../../../domain.types/users/user.task/user.task.types";
import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { IUserTaskActionHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.action.handler.interface";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class CareplanActionHandler implements IUserTaskActionHandler {
    
    private _careplanService: CareplanService = Injector.Container.resolve(CareplanService);


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

}

