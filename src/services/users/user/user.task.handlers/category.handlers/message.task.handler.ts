import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class MessageTaskHandler implements IUserTaskHandler {
    
    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing message task: ${JSON.stringify(userTask)}`);

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            const isWhatsApp = userTask.Channel === NotificationChannel.WhatsApp ||
                              userTask.Channel === NotificationChannel.WhatsappWati;
            
            const message = isWhatsApp
                ? ( rawContent)
                : (rawContent?.Description || actionData?.Description || userTask.Description || '');
            
            const messageType: BotMessagingType = isWhatsApp
                ? BotMessagingType.Template
                :  BotMessagingType.Text;
            
            const templateName = isWhatsApp ? (rawContent?.TemplateName ?? null) : null;

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

            return {
                MessageType  : messageType,
                Message      : messageString,
                TemplateName : templateName
            };

        } catch (error) {
            Logger.instance().log(`Error processing message task: ${error}`);
            throw error;
        }
    }

}

