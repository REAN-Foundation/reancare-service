import { Logger } from "../../../../common/logger";
import { Injector } from "../../../../startup/injector";
import { UserActionType } from "../../../../domain.types/users/user.task/user.task.types";
import { IUserTaskActionHandler } from "../../../../database/repository.interfaces/users/user/task.task/user.task.action.handler.interface";
import { CareplanActionHandler } from "./action.handlers/careplan.action.handler";

///////////////////////////////////////////////////////////////////////////////

export class UserTaskActionHandler {
 
    getActionHandler(actionType: UserActionType): IUserTaskActionHandler {
        try {
            switch (actionType) {
                case UserActionType.Careplan:
                    return Injector.Container.resolve(CareplanActionHandler);
                    // case UserActionType.Medication:
                    //     return Injector.Container.resolve(MedicationActionHandler);
                
                    // case UserActionType.Appointment:
                    //     return Injector.Container.resolve(AppointmentActionHandler);
                
                    // case UserActionType.Custom:
                    //     return Injector.Container.resolve(CustomActionHandler);
                
                    // Add more handlers as needed
                
                default:
                    Logger.instance().log(`No action handler found for action type: ${actionType}`);
                    return null;
            }
        } catch (error) {
            Logger.instance().log(`Error getting action handler for action type ${actionType}: ${error}`);
            return null;
        }
    }


}

