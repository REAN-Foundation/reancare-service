import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskChannelHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { Injector } from "../../../../../startup/injector";
import { INotificationService } from "../../../../../modules/communication/notification.service/notification.service.interface";
import { UserTaskHelper } from "../user.task.helper";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class WebPushChannelHandler implements IUserTaskChannelHandler {

    private readonly _notificationService: INotificationService = Injector.Container.resolve('INotificationService') as INotificationService;

    private readonly _userTaskHelper: UserTaskHelper = Injector.Container.resolve(UserTaskHelper);

    async sendMessage(userTask: UserTaskMessageDto, processedTask: ProcessedTaskDto): Promise<boolean> {
        try {
            const deviceTokens = await this._userTaskHelper.getUserDeviceTokens(userTask.UserId);
            if (!deviceTokens || deviceTokens.length === 0) {
                Logger.instance().log(`No web push subscriptions found for user: ${userTask.UserId}`);
                return false;
            }

            const title = this.buildTitle(userTask);
            const body = processedTask.Message;

            const notificationMessage = this._notificationService.formatNotificationMessage(
                userTask.Category,
                title,
                body
            );

            await this._notificationService.sendNotificationToMultipleDevice(deviceTokens, notificationMessage);

            Logger.instance().log(`Successfully sent WebPush to ${deviceTokens.length} subscriptions for task: ${userTask.id}`);
            return true;

        } catch (error) {
            Logger.instance().log(`Error sending WebPush message: ${error}`);
            return false;
        }
    }

    private buildTitle(userTask: UserTaskMessageDto): string {
        return userTask.Task || `${userTask.Category} Notification`;
    }

}
