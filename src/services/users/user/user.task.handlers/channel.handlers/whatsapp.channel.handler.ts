import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { UserTaskMessageDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { Injector } from "../../../../../startup/injector";
import { IBotService } from "../../../../../modules/communication/bot.service/bot.service.interface";
import { BotService } from "../../../../../modules/communication/bot.service/bot.service";
import { BotRequestDomainModel } from "../../../../../domain.types/miscellaneous/bot.request.types";
import { Helper } from "../../../../../common/helper";
import { BaseChannelHandler } from "./base.channel.handler";


///////////////////////////////////////////////////////////////////////////////

@injectable()
export class WhatsAppChannelHandler extends BaseChannelHandler {

    private _botService: IBotService = Injector.Container.resolve(BotService);
    
    async sendMessage(userTask: UserTaskMessageDto, processedTask: ProcessedTaskDto): Promise<boolean> {
        try {
            const personPhone = await this.getUserPhoneNumber(userTask.UserId);
            if (!personPhone) {
                Logger.instance().log(`User phone number not found for user: ${userTask.UserId}`);
                return false;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(personPhone);
            const channel = this.mapChannelToBotChannel(userTask.Channel)
            
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber  : normalizedPhoneNumber,
                ClientName   : userTask.TenantName,
                Channel      : channel,
                AgentName    : "Reancare",
                Provider     : userTask.TenantName,
                Type         : processedTask.MessageType,
                TemplateName : processedTask.TemplateName ?? null,
                Message      : processedTask.Message,
                Payload      : userTask
            };

            await this._botService.sendWhatsappMessage(botRequestModel);
            Logger.instance().log(`Successfully sent WhatsApp message to ${normalizedPhoneNumber} for task: ${userTask.id}`);
            return true;

        } catch (error) {
            Logger.instance().log(`Error sending WhatsApp message: ${error}`);
            return false;
        }
    }

    private mapChannelToBotChannel(channel: string): NotificationChannel {
        switch (channel) {
            case NotificationChannel.WhatsApp:
            case NotificationChannel.WhatsappWati:
                return NotificationChannel.WhatsappMeta;
            default:
                return NotificationChannel.WhatsappMeta;
        }
    }


}

