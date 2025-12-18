import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class MessageTaskHandler implements IUserTaskHandler {

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing message task: ${JSON.stringify(userTask)}`);

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            const channel = userTask.Channel as NotificationChannel;

            if (this.isWhatsAppChannel(channel)) {
                return this.processWhatsAppMessage(rawContent);
            }

            return this.processTextMessage(userTask, actionData, rawContent);

        } catch (error) {
            Logger.instance().log(`Error processing message task: ${error}`);
            throw error;
        }
    }

    private isWhatsAppChannel(channel: NotificationChannel): boolean {
        return [
            NotificationChannel.WhatsApp,
            NotificationChannel.WhatsappWati,
            NotificationChannel.WhatsappMeta
        ].includes(channel);
    }

    private processWhatsAppMessage(rawContent: any): ProcessedTaskDto {
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

    private processTextMessage(
        userTask: UserTaskMessageDto,
        actionData: UserTaskActionData,
        rawContent: any
    ): ProcessedTaskDto {
        const message = rawContent?.Description ||
                       actionData?.Description ||
                       userTask.Description;

        return {
            MessageType : BotMessagingType.Text,
            Message     : message
        };
    }

}

