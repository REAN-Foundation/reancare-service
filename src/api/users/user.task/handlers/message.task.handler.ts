import { injectable } from "tsyringe";
import { Logger } from "../../../../common/logger";
import { IUserTaskHandler } from "../../../../database/repository.interfaces/users/user/task/user.task.handler.interface";
import { ProcessedTaskResultDto } from "../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskMessageDto } from "../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskCategory } from "../../../../domain.types/users/user.task/user.task.types";
import { NotificationChannel } from "../../../../domain.types/general/notification/notification.types";
import { ApiError } from "../../../../common/api.error";
import { UserTaskActionData } from "../../../../domain.types/users/user.task/resolved.action.data.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class MessageTaskHandler implements IUserTaskHandler {
    
    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskResultDto> {
        try {
            Logger.instance().log(`Processing message task: ${JSON.stringify(userTask)}`);

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            const isWhatsApp = userTask.Channel === NotificationChannel.WhatsApp || 
                              userTask.Channel === NotificationChannel.WhatsappWati;
            
            const message = isWhatsApp 
                ? (actionData?.RawContent || '')
                : (rawContent?.Description || actionData?.Description || userTask.Description || '');
            
            const messageType = isWhatsApp 
                ? (rawContent?.TemplateName || 'text')
                : 'text';

            if (!message) {
                Logger.instance().log(`No message content found for task ${userTask.id}`);
                throw new ApiError(400, `Message content is required for Message category task`);
            }

            return {
                MessageType: messageType,
                Message: message
            };

        } catch (error) {
            Logger.instance().log(`Error processing message task: ${error}`);
            throw error;
        }
    }
}

