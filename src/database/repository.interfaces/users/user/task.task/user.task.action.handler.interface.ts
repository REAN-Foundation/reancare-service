import { UserActionType } from "../../../../../domain.types/users/user.task/user.task.types";
import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { UserTaskMessageDto } from "../../../../../domain.types/users/user.task/user.task.dto";

///////////////////////////////////////////////////////////////////////////////

export interface IUserTaskActionHandler {

    resolveAction(actionType: UserActionType, actionId: uuid): Promise<UserTaskActionData>;

    onTaskCompleted?(taskId: uuid, actionId: uuid): Promise<void>;

    enrichTaskMetadata?(userTask: UserTaskMessageDto): Promise<void>;
}

