import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto , ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { AssessmentService } from "../../../../clinical/assessment/assessment.service";
import { Injector } from "../../../../../startup/injector";
import { WhatsAppFlowTemplateRequest } from "../../../../../domain.types/webhook/whatsapp.meta.types";
import { ApiError } from "../../../../../common/api.error";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { AssessmentDomainModel } from "../../../../../domain.types/clinical/assessment/assessment.domain.model";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentTaskHandler implements IUserTaskHandler {
    
    private readonly _assessmentService: AssessmentService = Injector.Container.resolve(AssessmentService);
    
    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            
            const isAssessmentWithForm = !!(
                rawContent?.Metadata &&
                (userTask.Channel === NotificationChannel.WhatsApp ||
                 userTask.Channel === NotificationChannel.WhatsappWati)
            );
            
            if (isAssessmentWithForm) {
                return await this.processAssessmentWithForm(userTask, actionData);
            }
            
            return await this.processRegularAssessment(userTask, actionData, rawContent);
        } catch (error) {
            Logger.instance().log(`Error processing assessment task: ${error}`);
            throw error;
        }
    }

    private async processAssessmentWithForm(
        userTask: UserTaskMessageDto,
        actionData: UserTaskActionData
    ): Promise<ProcessedTaskDto> {
        const whatsappFormMetadata = this.getWhatsappFormMetadata(actionData.RawContent);
        this.validateWhatsappFormMetadata(whatsappFormMetadata);
        
        const processedTask: ProcessedTaskDto = {
            MessageType : BotMessagingType.AssessmentForm,
            Message     : JSON.stringify({ message: "Sending assessment with form to Rean bot" }),
            Metadata    : whatsappFormMetadata
        };
        
        return processedTask;
    }

    private async processRegularAssessment(
        userTask: UserTaskMessageDto,
        actionData: UserTaskActionData,
        rawContent: any
    ): Promise<ProcessedTaskDto> {
        const assessmentDomainModel: AssessmentDomainModel = {
            PatientUserId        : userTask.UserId ?? null,
            AssessmentTemplateId : rawContent?.ReferenceTemplateId ?? null,
            UserTaskId           : userTask.id,
            ScheduledDateString  : new Date().toISOString()
                .split('T')[0] ?? null,
            ParentActivityId : actionData?.id ?? null
        };
        
        const assessment = await this._assessmentService.create(assessmentDomainModel);
        userTask.Action = { Assessment: assessment };
        
        const processedTask: ProcessedTaskDto = {
            MessageType : BotMessagingType.Assessment,
            Message     : JSON.stringify({ message: "Sending assessment to Rean bot" }),
            Metadata    : null
        };
        
        return processedTask;
    }

    private readonly getWhatsappFormMetadata = (rawContent: string): WhatsAppFlowTemplateRequest => {
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

    private readonly validateWhatsappFormMetadata = (whatsappFormMetadata: WhatsAppFlowTemplateRequest): boolean => {
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

    shouldAutoFinish(): boolean {
        return false;
    }

}

