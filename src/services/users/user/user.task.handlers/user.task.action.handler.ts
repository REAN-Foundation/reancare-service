import { injectable } from "tsyringe";
import { Logger } from "../../../../common/logger";
import { Injector } from "../../../../startup/injector";
import { UserActionType } from "../../../../domain.types/users/user.task/user.task.types";
import { IUserTaskActionHandler } from "../../../../database/repository.interfaces/users/user/task.task/user.task.action.handler.interface";
import { IActionHandlerResolver } from "../../../../database/repository.interfaces/users/user/task.task/user.task.action.handler.resolver.interface";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserTaskActionHandler implements IActionHandlerResolver {

    private static handlers = new Map<UserActionType, any>();

    public registerHandler(actionType: UserActionType, handlerClass: any): void {
        UserTaskActionHandler.handlers.set(actionType, handlerClass);
        Logger.instance().log(`Registered action handler for type: ${actionType}`);
    }

    public getActionHandler(actionType: UserActionType): IUserTaskActionHandler | null {
        try {
            const HandlerClass = UserTaskActionHandler.handlers.get(actionType);

            if (!HandlerClass) {
                Logger.instance().log(`No action handler registered for action type: ${actionType}`);
                return null;
            }

            return Injector.Container.resolve(HandlerClass);

        } catch (error) {
            Logger.instance().log(`Error getting action handler for action type ${actionType}: ${error}`);
            return null;
        }
    }

}

