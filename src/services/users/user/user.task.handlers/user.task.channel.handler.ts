import { injectable } from "tsyringe";
import { Logger } from "../../../../common/logger";
import { Injector } from "../../../../startup/injector";
import { NotificationChannel } from "../../../../domain.types/general/notification/notification.types";
import { IUserTaskChannelHandler } from "../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { IChannelHandlerResolver } from "../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.resolver.interface";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserTaskChannelHandler implements IChannelHandlerResolver {

    private static readonly handlers = new Map<NotificationChannel, any>();

    public registerHandler(channel: NotificationChannel, handlerClass: any): void {
        UserTaskChannelHandler.handlers.set(channel, handlerClass);
        Logger.instance().log(`Registered channel handler for channel: ${channel}`);
    };

    public getChannelHandler(channel: NotificationChannel): IUserTaskChannelHandler | null {
        try {
            const HandlerClass = UserTaskChannelHandler.handlers.get(channel);

            if (!HandlerClass) {
                Logger.instance().log(`No channel handler registered for channel: ${channel}`);
                return null;
            }

            return Injector.Container.resolve(HandlerClass);

        } catch (error) {
            Logger.instance().log(`Error getting channel handler for ${channel}: ${error}`);
            return null;
        }
    };

}

