import { injectable } from "tsyringe";
import { Logger } from "../../../../common/logger";
import { IUserTaskHandler } from "../../../../database/repository.interfaces/users/user/task/user.task.handler.interface";
import { ProcessedTaskResultDto } from "../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskMessageDto } from "../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskCategory } from "../../../../domain.types/users/user.task/user.task.types";
import { NotificationChannel } from "../../../../domain.types/general/notification/notification.types";
import { AssessmentService } from "../../../../services/clinical/assessment/assessment.service";
import { Injector } from "../../../../startup/injector";
import { WhatsAppFlowTemplateRequest } from "../../../../domain.types/webhook/whatsapp.meta.types";
import { ApiError } from "../../../../common/api.error";
import { UserTaskActionData } from "../../../../domain.types/users/user.task/resolved.action.data.types";
import { AssessmentDomainModel } from "../../../../domain.types/clinical/assessment/assessment.domain.model";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentTaskHandler implements IUserTaskHandler {
    
    private _assessmentService: AssessmentService = Injector.Container.resolve(AssessmentService);
    
    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskResultDto> {
        try {
            Logger.instance().log(`Processing assessment task: ${JSON.stringify(userTask)}`);
            
            if (userTask.Category !== UserTaskCategory.Assessment) {
                throw new ApiError(400, `Task handler mismatch. Expected Assessment category, got ${userTask.Category}`);
            }

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            let isAssessmentWithForm = false;
            let messageType = '';
            let message = '';
            let metadata: any = null;
            if (
                rawContent?.Metadata &&
                (userTask.Channel === NotificationChannel.WhatsApp || 
                 userTask.Channel === NotificationChannel.WhatsappWati)
            ) {
                const whatsappFormMetadata = this.getWhatsappFormMetadata(actionData.RawContent);
                this.validateWhatsappFormMetadata(whatsappFormMetadata);
                messageType = 'reancareAssessmentWithForm';
                message = actionData.RawContent;
                metadata = whatsappFormMetadata;
                isAssessmentWithForm = true;
                Logger.instance().log(`IsAssessmentWithForm: true for task ${JSON.stringify(userTask)}`);
            }

            if (!isAssessmentWithForm) {
                const assessmentDomainModel: AssessmentDomainModel = {
                    PatientUserId        : userTask.UserId ?? null,
                    AssessmentTemplateId : rawContent?.ReferenceTemplateId ?? null,
                    UserTaskId           : userTask.id,
                    ScheduledDateString  : new Date().toISOString().split('T')[0] ?? null,
                    ParentActivityId     : actionData?.id ?? null
                };
                const assessment = await this._assessmentService.create(assessmentDomainModel);
                userTask.Action = { Assessment: assessment };
                Logger.instance().log(`Assessment created for task ${userTask.id}`);
                
                messageType = 'reancareAssessment';
                message = "{\"message\":\"Sending assessment to Rean bot\"}";
            }

            return {
                MessageType: messageType,
                Message: message,
                Metadata: metadata
            };

        } catch (error) {
            Logger.instance().log(`Error processing assessment task: ${error}`);
            throw error;
        }
    }

    private getWhatsappFormMetadata = (rawContent: string): WhatsAppFlowTemplateRequest => {
        try {
            if (!rawContent) {
                return null;
            }
            const content = JSON.parse(rawContent);
            if (content?.Metadata) {
                const metadata = JSON.parse(content.Metadata) as WhatsAppFlowTemplateRequest;
                return metadata;
            }
            return null;
        }
        catch (error) {
            Logger.instance().log(`Error getting whatsapp form metadata: ${JSON.stringify(error.message, null, 2)}`);
            return null;
        }
    };

    private validateWhatsappFormMetadata = (whatsappFormMetadata: WhatsAppFlowTemplateRequest): boolean => {
        if (
            !whatsappFormMetadata ||
            whatsappFormMetadata.Type !== 'template' ||
            !whatsappFormMetadata.TemplateName
        ) {
            Logger.instance().log(`Whatsapp form metadata is not valid : ${JSON.stringify(whatsappFormMetadata)}`);
            throw new ApiError(400, `Whatsapp form metadata is not valid`);
        }
        return true;
    };
}

