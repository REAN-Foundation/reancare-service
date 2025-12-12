import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskChannelHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { Injector } from "../../../../../startup/injector";
import { IBotService } from "../../../../../modules/communication/bot.service/bot.service.interface";
import { BotService } from "../../../../../modules/communication/bot.service/bot.service";
import { BotRequestDomainModel } from "../../../../../domain.types/miscellaneous/bot.request.types";
import { Helper } from "../../../../../common/helper";
import { UserTaskHelper } from "../user.task.helper";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class WhatsAppChannelHandler implements IUserTaskChannelHandler {

    private readonly _botService: IBotService = Injector.Container.resolve(BotService);
    
    async sendMessage(userTask: UserTaskMessageDto, processedTask: ProcessedTaskDto): Promise<boolean> {
        try {
            const personPhone = await UserTaskHelper.getUserPhoneNumber(userTask.UserId);
            if (!personPhone) {
                Logger.instance().log(`User phone number not found for user: ${userTask.UserId}`);
                return false;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(personPhone);
            
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber  : normalizedPhoneNumber,
                ClientName   : userTask.TenantName,
                Channel      : NotificationChannel.WhatsappMeta,
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

}

