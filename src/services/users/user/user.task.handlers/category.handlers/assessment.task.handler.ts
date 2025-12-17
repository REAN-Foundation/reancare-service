import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";
import { AssessmentService } from "../../../../clinical/assessment/assessment.service";
import { Injector } from "../../../../../startup/injector";
import { ChannelMetadata } from "../../../../../domain.types/webhook/channel.metadata.types";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { AssessmentDomainModel } from "../../../../../domain.types/clinical/assessment/assessment.domain.model";
import { BotMessagingType } from "../../../../../domain.types/miscellaneous/bot.request.types";
import { MetadataHandler } from "./metadata.formatters/metadata.handler";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentTaskHandler implements IUserTaskHandler {

    private readonly _assessmentService: AssessmentService = Injector.Container.resolve(AssessmentService);

    private readonly _metadataHandler: MetadataHandler = Injector.Container.resolve(MetadataHandler);

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;

            const hasMetadata = rawContent?.Metadata;
            const channelMetadata = hasMetadata ? this._metadataHandler.parseChannelMetadata(rawContent.Metadata) : null;
            const channel = userTask.Channel as NotificationChannel;
            const hasChannelConfig =
             channelMetadata?.Channels && this._metadataHandler.hasChannelConfiguration(channelMetadata.Channels, channel);

            if (hasMetadata && hasChannelConfig) {
                return await this.processAssessmentWithForm(userTask, actionData, channelMetadata);
            }

            return await this.processRegularAssessment(userTask, actionData, rawContent);
        } catch (error) {
            Logger.instance().log(`Error processing assessment task: ${error}`);
            throw error;
        }
    }

    private async processAssessmentWithForm(
        userTask: UserTaskMessageDto,
        actionData: UserTaskActionData,
        channelMetadata: ChannelMetadata
    ): Promise<ProcessedTaskDto> {

        this._metadataHandler.validateChannelMetadata(channelMetadata);

        const channel = userTask.Channel as NotificationChannel;

        const channelConfig = this._metadataHandler.getChannelConfiguration(channelMetadata, channel);

        const formMetadata = this._metadataHandler.buildChannelFormMetadata(channelMetadata, channelConfig, channel);

        const processedTask: ProcessedTaskDto = {
            MessageType : BotMessagingType.AssessmentForm,
            Message     : JSON.stringify({
                message : `Sending assessment with ${userTask.Channel} form to Rean bot`
            }),
            Metadata : formMetadata
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

}

