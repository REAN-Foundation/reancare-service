import { Logger } from "../../../common/logger";
import { Injector } from "../../../startup/injector";
import { NotificationChannel } from "../../../domain.types/general/notification/notification.types";
import { IUserTaskChannelHandler } from "../../../database/repository.interfaces/users/user/task/user.task.channel.handler.interface";
import { WhatsAppChannelHandler } from "./handlers/whatsapp.channel.handler";
import { TelegramChannelHandler } from "./handlers/telegram.channel.handler";

///////////////////////////////////////////////////////////////////////////////

export class UserTaskChannelHandler {
 
    getChannelHandler(channel: NotificationChannel): IUserTaskChannelHandler {
        try {
            switch (channel) {
                case NotificationChannel.WhatsApp:
                case NotificationChannel.WhatsappWati:
                case NotificationChannel.WhatsappMeta:
                    return Injector.Container.resolve(WhatsAppChannelHandler);
                
                case NotificationChannel.Telegram:
                    return Injector.Container.resolve(TelegramChannelHandler);
                
                // Add more handlers as needed
                // case NotificationChannel.Email:
                //     return Injector.Container.resolve(EmailChannelHandler);
                // case NotificationChannel.SMS:
                //     return Injector.Container.resolve(SmsChannelHandler);
                
                default:
                    Logger.instance().log(`No channel handler found for channel: ${channel}`);
                    return null;
            }
        } catch (error) {
            Logger.instance().log(`Error getting channel handler for ${channel}: ${error}`);
            return null;
        }
    }
}




