import { injectable } from "tsyringe";
import { IChannelMessageProcessor } from "../../../../../../database/repository.interfaces/users/user/task.task/channel.message.processor.interface";
import { ProcessedTaskDto, UserTaskMessageDto } from "../../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class WhatsAppMessageProcessor implements IChannelMessageProcessor {

    processMessage(
        userTask: UserTaskMessageDto,
        actionData: UserTaskActionData,
        rawContent: any
    ): ProcessedTaskDto {

        const message = rawContent || {};

        if (message.Variables || message.TemplateVariables) {
            if (message.TemplateVariables) {
                message.Variables = message.TemplateVariables;
                const buttonIds = message.TemplateButtonIds;
                if (buttonIds != null && Array.isArray(buttonIds) && buttonIds.length > 0) {
                    message.ButtonsIds = message.TemplateButtonIds;
                }
            }
        }

        const messageString = typeof message === 'string' ? message : JSON.stringify(message);
        const templateName = rawContent?.TemplateName ?? null;

        return {
            MessageType  : BotMessagingType.Template,
            Message      : messageString,
            TemplateName : templateName
        };
    }
    
}
