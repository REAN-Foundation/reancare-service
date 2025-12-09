import { UserTaskCategory } from "../../../../../domain.types/users/user.task/user.task.types";
import { IUserTaskHandler } from "./user.task.handler.interface";

///////////////////////////////////////////////////////////////////////////////

export interface ITaskHandlerResolver {

    getTaskHandler(category: UserTaskCategory): IUserTaskHandler | null;

    registerHandler(category: UserTaskCategory, handlerClass: any): void;
}
