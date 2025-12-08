import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskChannelHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { ProcessedTaskDto, UserTaskMessageDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { IPersonRepo } from "../../../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../../../database/repository.interfaces/users/user/user.repo.interface";
import { Injector } from "../../../../../startup/injector";
import { IBotService } from "../../../../../modules/communication/bot.service/bot.service.interface";
import { BotService } from "../../../../../modules/communication/bot.service/bot.service";
import { BotRequestDomainModel } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class TelegramChannelHandler implements IUserTaskChannelHandler {
    
    private _personRepo: IPersonRepo = Injector.Container.resolve('IPersonRepo');

    private _userRepo: IUserRepo = Injector.Container.resolve('IUserRepo');

    private _botService: IBotService = Injector.Container.resolve(BotService);
    
    async sendMessage(userTask: UserTaskMessageDto, processedResult: ProcessedTaskDto): Promise<boolean> {
        try {

            const telegramChatId = await this.getUserTelegramChatId(userTask.UserId);
            if (!telegramChatId) {
                Logger.instance().log(`User Telegram chat ID not found for user: ${userTask.UserId}`);
                return false;
            }

            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : telegramChatId,
                ClientName  : userTask.TenantName,
                Channel     : NotificationChannel.Telegram,
                AgentName   : "Reancare",
                Type        : processedResult.MessageType,
                Message     : processedResult.Message,
                Payload     : userTask
            };

            await this._botService.sendTelegramMessage(botRequestModel);
            
            Logger.instance().log(`Successfully sent Telegram message to ${telegramChatId} for task: ${userTask.id}`);
            return true;

        } catch (error) {
            Logger.instance().log(`Error sending Telegram message: ${error}`);
            return false;
        }
    }

    private async getUserTelegramChatId(userId: string): Promise<string> {
        const user = await this._userRepo.getById(userId);
        const person = user ? await this._personRepo.getById(user.PersonId) : null;
        return person?.UniqueReferenceId ?? null;
    }

}

