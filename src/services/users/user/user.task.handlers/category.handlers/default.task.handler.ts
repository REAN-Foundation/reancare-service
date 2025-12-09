import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { ProcessedTaskDto, UserTaskMessageDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

/**
 * Default handler for task categories that don't have specific handlers
 * Provides basic message processing functionality
 */
@injectable()
export class DefaultTaskHandler implements IUserTaskHandler {

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing task with default handler for category: ${userTask.Category}`);

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            const message = rawContent?.Description || actionData?.Description || userTask.Description || '';

            const messageString = typeof message === 'string' ? message : JSON.stringify(message);

            return {
                MessageType : BotMessagingType.Text,
                Message     : messageString
            };

        } catch (error) {
            Logger.instance().log(`Error in default task handler: ${error}`);
            throw error;
        }
    }


    shouldAutoFinish(): boolean {
        return true;
    }

}
