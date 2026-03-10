import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class NutritionTaskHandler implements IUserTaskHandler {

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing nutrition task: ${JSON.stringify(userTask)}`);

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            const message = this.buildMessage(actionData, rawContent);

            return {
                MessageType : BotMessagingType.Text,
                Message     : message
            };

        } catch (error) {
            Logger.instance().log(`Error processing nutrition task: ${error}`);
            throw error;
        }
    }

    private buildMessage(actionData: UserTaskActionData, rawContent: any): string {
        if (rawContent?.Food) {
            const parts = [`Nutrition: ${rawContent.Food}`];

            if (rawContent.Servings && rawContent.ServingUnit) {
                parts.push(`(${rawContent.Servings} ${rawContent.ServingUnit})`);
            }

            if (rawContent.Description) {
                parts.push(`- ${rawContent.Description}`);
            }

            return parts.join(' ');
        }

        return actionData?.Description ||
               actionData?.Title ||
               'Nutrition Reminder';
    }

}
