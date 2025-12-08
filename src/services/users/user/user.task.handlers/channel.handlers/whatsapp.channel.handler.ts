import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskChannelHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { UserTaskMessageDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { IPersonRepo } from "../../../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../../../database/repository.interfaces/users/user/user.repo.interface";
import { Injector } from "../../../../../startup/injector";
import { IBotService } from "../../../../../modules/communication/bot.service/bot.service.interface";
import { BotService } from "../../../../../modules/communication/bot.service/bot.service";
import { BotRequestDomainModel, BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";
import { Helper } from "../../../../../common/helper";


///////////////////////////////////////////////////////////////////////////////

@injectable()
export class WhatsAppChannelHandler implements IUserTaskChannelHandler {
    
    private _personRepo: IPersonRepo = Injector.Container.resolve('IPersonRepo');

    private _userRepo: IUserRepo = Injector.Container.resolve('IUserRepo');

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

    private getMessagingType(messageType: BotMessagingType): BotMessagingType {
        if (messageType === BotMessagingType.Text) {
            return BotMessagingType.Template;
        }
        return messageType;
    }
    

    private async getUserPhoneNumber(userId: string): Promise<string> {
        try {
            const user = await this._userRepo.getById(userId);
            if (!user) {
                return null;
            }
            const person = await this._personRepo.getById(user.PersonId);
            return person?.Phone ?? null;
        } catch (error) {
            Logger.instance().log(`Error getting user phone number: ${error}`);
            return null;
        }
    }

}

