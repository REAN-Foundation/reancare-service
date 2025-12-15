import { injectable } from "tsyringe";
import { IChannelMessageProcessor } from "../../../../../../database/repository.interfaces/users/user/task.task/channel.message.processor.interface";
import { ProcessedTaskDto, UserTaskMessageDto } from "../../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class TelegramMessageProcessor implements IChannelMessageProcessor {

    processMessage(
        userTask: UserTaskMessageDto,
        actionData: UserTaskActionData,
        rawContent: any
    ): ProcessedTaskDto {

        const message = rawContent?.Description ||
                       actionData?.Description ||
                       userTask.Description ||
                       '';

        const messageString = typeof message === 'string' ? message : JSON.stringify(message);

        return {
            MessageType : BotMessagingType.Text,
            Message     : messageString
        };
    }
    
}
