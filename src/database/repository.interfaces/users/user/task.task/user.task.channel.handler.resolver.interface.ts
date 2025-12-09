import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { IUserTaskChannelHandler } from "./user.task.channel.handler.interface";

///////////////////////////////////////////////////////////////////////////////

export interface IChannelHandlerResolver {

    getChannelHandler(channel: NotificationChannel): IUserTaskChannelHandler | null;

    registerHandler(channel: NotificationChannel, handlerClass: any): void;
}
