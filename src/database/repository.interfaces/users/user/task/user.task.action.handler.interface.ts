import { UserActionType } from "../../../../../domain.types/users/user.task/user.task.types";
import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";

///////////////////////////////////////////////////////////////////////////////

export interface IUserTaskActionHandler {
    
    resolveAction(actionType: UserActionType, actionId: uuid): Promise<UserTaskActionData>;
}


