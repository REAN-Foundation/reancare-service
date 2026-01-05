import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskChannelHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { Injector } from "../../../../../startup/injector";
import { EmailService } from "../../../../../modules/communication/email/email.service";
import { EmailDetails } from "../../../../../modules/communication/email/email.details";
import { UserTaskHelper } from "../user.task.helper";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class EmailChannelHandler implements IUserTaskChannelHandler {

    private readonly _emailService: EmailService = Injector.Container.resolve(EmailService);

    private readonly _userTaskHelper: UserTaskHelper = Injector.Container.resolve(UserTaskHelper);

    async sendMessage(userTask: UserTaskMessageDto, processedTask: ProcessedTaskDto): Promise<boolean> {
        try {
            const userEmail = await this._userTaskHelper.getUserEmail(userTask.UserId);
            if (!userEmail) {
                Logger.instance().log(`User email not found for user: ${userTask.UserId}`);
                return false;
            }

            const subject = this.buildSubject(userTask, processedTask);
            const emailDetails: EmailDetails = {
                EmailTo : userEmail,
                Subject : subject,
                Body    : processedTask.Message
            };

            const result = await this._emailService.sendEmail(emailDetails, false);

            if (result) {
                Logger.instance().log(`Successfully sent Email to ${userEmail} for task: ${userTask.id}`);
            } else {
                Logger.instance().log(`Failed to send Email to ${userEmail} for task: ${userTask.id}`);
            }

            return result;

        } catch (error) {
            Logger.instance().log(`Error sending Email message: ${error}`);
            return false;
        }
    }

    private buildSubject(userTask: UserTaskMessageDto, processedTask: ProcessedTaskDto): string {
        const taskCategory = userTask.ActionType || 'Task';
        return `${userTask.TenantName} - ${taskCategory} Reminder`;
    }

}
