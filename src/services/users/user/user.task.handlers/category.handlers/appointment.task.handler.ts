import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class AppointmentTaskHandler implements IUserTaskHandler {

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing appointment task: ${JSON.stringify(userTask)}`);

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            const message = this.buildMessage(actionData, rawContent);

            return {
                MessageType : BotMessagingType.Text,
                Message     : message
            };

        } catch (error) {
            Logger.instance().log(`Error processing appointment task: ${error}`);
            throw error;
        }
    }

    private buildMessage(actionData: UserTaskActionData, rawContent: any): string {
        const title = actionData?.Title || 'Appointment Reminder';

        if (actionData?.ScheduledAt) {
            const scheduledDate = new Date(actionData.ScheduledAt);
            const dateStr = scheduledDate.toLocaleDateString();
            const timeStr = scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const parts = [`${title} on ${dateStr} at ${timeStr}`];

            if (actionData?.Description) {
                parts.push(`- ${actionData.Description}`);
            }

            return parts.join(' ');
        }

        return actionData?.Description || title;
    }

}
