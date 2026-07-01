import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class EducationalAnimationTaskHandler implements IUserTaskHandler {

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing educational animation task: ${JSON.stringify(userTask)}`);

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            const message = this.buildMessage(actionData, rawContent);

            return {
                MessageType : BotMessagingType.Text,
                Message     : message
            };

        } catch (error) {
            Logger.instance().log(`Error processing educational animation task: ${error}`);
            throw error;
        }
    }

    private buildMessage(actionData: UserTaskActionData, rawContent: any): string {
        const title = actionData?.Title || 'Educational Animation';
        const description = actionData?.Description || '';
        const url = actionData?.Url || rawContent?.Url || '';

        if (url) {
            return `${title}\n${description}\n\nView here: ${url}`;
        }

        return `${title}\n${description}`;
    }

}
