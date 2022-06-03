import { TaskBase } from "./task.base";
import { UserActionType } from "./user.task.types";

export interface UserTaskDomainModel extends TaskBase {
    id?                  : string;
    DisplayId?           : string;
    ActionType?          : UserActionType;
    ActionId?            : string;
}
