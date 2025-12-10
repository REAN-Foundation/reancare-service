import { NotificationChannel } from "../../../domain.types/general/notification/notification.types";
import { IUserTaskChannelHandler } from "../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { Injector } from "../../../startup/injector";
import { WhatsAppChannelHandler } from "./user.task.handlers/channel.handlers/whatsapp.channel.handler";
import { TelegramChannelHandler } from "./user.task.handlers/channel.handlers/telegram.channel.handler";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../domain.types/users/user.task/user.task.dto";
import { Logger } from "../../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UserTaskChannelResolver {

    sendMessage = async (
        channel: NotificationChannel,
        userTask: UserTaskMessageDto,
        processedTask: ProcessedTaskDto
    ): Promise<boolean> => {
        const channelHandler = this.getChannelHandler(channel);
        if (!channelHandler) {
            Logger.instance().log(`No channel handler found for channel: ${channel}`);
            return false;
        }
        return await channelHandler.sendMessage(userTask, processedTask);
    };

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

    //#endregion

}
