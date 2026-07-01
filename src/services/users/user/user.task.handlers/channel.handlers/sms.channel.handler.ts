import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskChannelHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { Injector } from "../../../../../startup/injector";
import { IMessagingService } from "../../../../../modules/communication/messaging.service/messaging.service.interface";
import { Helper } from "../../../../../common/helper";
import { UserTaskHelper } from "../user.task.helper";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class SmsChannelHandler implements IUserTaskChannelHandler {

    private readonly _messagingService: IMessagingService = Injector.Container.resolve('IMessagingService') as IMessagingService;

    private readonly _userTaskHelper: UserTaskHelper = Injector.Container.resolve(UserTaskHelper);

    async sendMessage(userTask: UserTaskMessageDto, processedTask: ProcessedTaskDto): Promise<boolean> {
        try {
            const personPhone = await this._userTaskHelper.getUserPhoneNumber(userTask.UserId);
            if (!personPhone) {
                Logger.instance().log(`User phone number not found for user: ${userTask.UserId}`);
                return false;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(personPhone);
            const result = await this._messagingService.sendSMS(normalizedPhoneNumber, processedTask.Message);

            if (result) {
                Logger.instance().log(`Successfully sent SMS to ${normalizedPhoneNumber} for task: ${userTask.id}`);
            } else {
                Logger.instance().log(`Failed to send SMS to ${normalizedPhoneNumber} for task: ${userTask.id}`);
            }

            return result;

        } catch (error) {
            Logger.instance().log(`Error sending SMS message: ${error}`);
            return false;
        }
    }

}
