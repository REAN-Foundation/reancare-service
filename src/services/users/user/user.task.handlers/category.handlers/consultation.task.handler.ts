import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class ConsultationTaskHandler implements IUserTaskHandler {

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing consultation task: ${JSON.stringify(userTask)}`);

            const message = actionData?.Description ||
                           actionData?.Title ||
                           'Consultation Reminder';

            return {
                MessageType : BotMessagingType.Text,
                Message     : message
            };

        } catch (error) {
            Logger.instance().log(`Error processing consultation task: ${error}`);
            throw error;
        }
    }

}
