import { UserActionType } from "../../../../../domain.types/users/user.task/user.task.types";
import { IUserTaskActionHandler } from "./user.task.action.handler.interface";

///////////////////////////////////////////////////////////////////////////////

export interface IActionHandlerResolver {

    getActionHandler(actionType: UserActionType): IUserTaskActionHandler | null;

    registerHandler(actionType: UserActionType, handlerClass: any): void;
}
