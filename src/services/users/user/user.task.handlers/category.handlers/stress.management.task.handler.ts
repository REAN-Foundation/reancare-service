import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class StressManagementTaskHandler implements IUserTaskHandler {

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing stress management task: ${JSON.stringify(userTask)}`);

            const message = actionData?.Description ||
                           actionData?.Title ||
                           'Stress Management Activity';

            return {
                MessageType : BotMessagingType.Text,
                Message     : message
            };

        } catch (error) {
            Logger.instance().log(`Error processing stress management task: ${error}`);
            throw error;
        }
    }

}
