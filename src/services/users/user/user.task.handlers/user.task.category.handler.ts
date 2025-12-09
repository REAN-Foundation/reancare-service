import { injectable } from "tsyringe";
import { Logger } from "../../../../common/logger";
import { Injector } from "../../../../startup/injector";
import { UserTaskCategory } from "../../../../domain.types/users/user.task/user.task.types";
import { IUserTaskHandler } from "../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { ITaskHandlerResolver } from "../../../../database/repository.interfaces/users/user/task.task/user.task.handler.resolver.interface";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserTaskHandler implements ITaskHandlerResolver {

    private static readonly handlers = new Map<UserTaskCategory, any>();

    private static defaultHandler: any = null;

    public registerHandler(category: UserTaskCategory, handlerClass: any): void {
        UserTaskHandler.handlers.set(category, handlerClass);
        Logger.instance().log(`Registered task handler for category: ${category}`);
    }

    public static setDefaultHandler(handlerClass: any): void {
        UserTaskHandler.defaultHandler = handlerClass;
        Logger.instance().log('Registered default task handler for unhandled categories');
    }

    public getTaskHandler(category: UserTaskCategory): IUserTaskHandler | null {
        try {
            const HandlerClass = UserTaskHandler.handlers.get(category);

            if (!HandlerClass) {
                Logger.instance().log(`No specific handler registered for task category: ${category}`);

                if (UserTaskHandler.defaultHandler) {
                    Logger.instance().log(`Using default handler for category: ${category}`);
                    return Injector.Container.resolve(UserTaskHandler.defaultHandler);
                }

                return null;
            }

            return Injector.Container.resolve(HandlerClass);

        } catch (error) {
            Logger.instance().log(`Error getting task handler for category ${category}: ${error}`);
            return null;
        }
    }

}

