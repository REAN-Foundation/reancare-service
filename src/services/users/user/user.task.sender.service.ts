import { inject, injectable } from "tsyringe";
import * as asyncLib from 'async';
import { Logger } from "../../../common/logger";
import { Loader } from "../../../startup/loader";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { IUserTaskRepo } from "../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { UserTaskCategory } from "../../../domain.types/users/user.task/user.task.types";
import { AssessmentService } from "../../../services/clinical/assessment/assessment.service";
import { NotificationChannel } from "../../../domain.types/general/notification/notification.types";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { ICareplanRepo } from "../../../database/repository.interfaces/clinical/careplan.repo.interface";
import { Injector } from "../../../startup/injector";
import { ChatBotTaskDto } from "../../../domain.types/users/user.task/user.task.dto";
import { CareplanActivityDto } from "../../../domain.types/clinical/careplan/activity/careplan.activity.dto";
import { WhatsAppFlowTemplateRequest } from "../../../domain.types/webhook/whatsapp.meta.types";
import { ApiError } from "../../../common/api.error";

////////////////////////////////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT = 4;

@injectable()
export class UserTaskSenderService {

    _assessmentService: AssessmentService = null;

    constructor(
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
    ) {
        this._assessmentService = Injector.Container.resolve(AssessmentService);
    }

    public _q = asyncLib.queue((timePeriod: number, onCompleted) => {
        (async () => {
            await this.sendUserTasks(timePeriod);
            onCompleted();
        })();
    }, ASYNC_TASK_COUNT);

    public enqueueSendUserTasks = async (timePeriodMin: number) => {
        try {
            this.enqueue(timePeriodMin);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    //#region Privates

    private enqueue = (timePeriod: number) => {
        this._q.push(timePeriod, (timePeriod, error) => {
            if (error) {
                Logger.instance().log(`Error sending reminders: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error sending reminders: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Sent reminders!`);
            }
        });
    };

    private sendUserTasks = async (timePeriod: number) => {
        try {
            const userTasks: ChatBotTaskDto[] = await this._userTaskRepo.getUserTasksOfSelectiveChannel(timePeriod);
            if (!userTasks || userTasks.length === 0) {
                return;
            }
            for await (const userTask of userTasks) {
                const careplanActivity = await this._careplanRepo.getActivity(userTask.ActionId);
                userTask.Sequence = careplanActivity.Sequence;
                userTask.Language = careplanActivity.Language;
                Logger.instance().log(`User task with language : ${JSON.stringify(userTask)} `);
            }
           
            userTasks.sort((a, b) => {
                return a.Sequence - b.Sequence;
            });
            for await (const userTask of userTasks) {
                if (userTask.ActionId != null && userTask.ActionType === 'Careplan') {
                    await this.sendUserTaskOnBot(userTask.UserId, userTask);
                    await this.timer(300);
                } else {
                    continue;
                }
            }

        }

        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    private sendUserTaskOnBot = async (userId: string, userTask: ChatBotTaskDto): Promise<boolean> => {
        try {
            const personPhone = await this.getUserDetails(userId, userTask.Channel);

            let messageType = '';
            let message = '';

            const careplanActivity: CareplanActivityDto = await this._careplanRepo.getActivity(userTask.ActionId);
            const rawContent = JSON.parse(careplanActivity.RawContent);
            let isAssessmentWithForm = false;

            if (
                userTask.Category === UserTaskCategory.Assessment &&
                rawContent?.Metadata &&
                userTask.Channel === NotificationChannel.WhatsApp || userTask.Channel === NotificationChannel.WhatsappWati
            ) {
                const whatsappFormMetadata = this.getWhatsappFormMetadata(careplanActivity.RawContent);
                this.validateWhatsappFormMetadata(whatsappFormMetadata);
                messageType = 'reancareAssessmentWithForm';
                message = JSON.stringify({ message: "Sending assessment with form to Rean bot" });
                userTask.Metadata = whatsappFormMetadata;
                isAssessmentWithForm = true;
                Logger.instance().log(`IsAssessmentWithForm: true for task ${JSON.stringify(userTask)}`);
            }
            if (userTask.Category === UserTaskCategory.Assessment && !isAssessmentWithForm) {
                const entity = {
                    PatientUserId        : userTask.UserId ?? null,
                    AssessmentTemplateId : rawContent.ReferenceTemplateId ?? null,
                    UserTaskId           : userTask.id,
                    ScheduledDateString  : new Date().toISOString()
                        .split('T')[0] ?? null,
                };
                const assessment = await this._assessmentService.create(entity);
                userTask.Action = { Assessment: assessment };
                messageType = 'reancareAssessment';
                message  = "{\"message\":\"Sending assessment to Rean bot\"}";

            } else if (userTask.Category === 'Message' && userTask.Channel === NotificationChannel.Telegram) {
                message = rawContent.Description;
                messageType = 'text';
            } else if (userTask.Category === 'Message' && (userTask.Channel === NotificationChannel.WhatsApp || userTask.Channel === NotificationChannel.WhatsappWati)) {
                message = careplanActivity.RawContent;
                messageType = rawContent.TemplateName;
            }

            let booleanResponse = false;
            const payload = JSON.stringify(userTask);
            if (userTask.Channel === NotificationChannel.Telegram) {
                booleanResponse = await Loader.messagingService.sendMessage(userTask.TenantName, "telegram", personPhone,
                    messageType, null,  message, payload);
            } else if (userTask.Channel === NotificationChannel.WhatsApp ||
                userTask.Channel === NotificationChannel.WhatsappWati ) {
                booleanResponse = await Loader.messagingService.sendWhatsappWithReanBot(personPhone, message,
                    userTask.TenantName, messageType, null, payload, userTask.Channel);
            }

            if (booleanResponse === false) {
                Logger.instance().log(`Something went wrong with rean bot wrapper`);
                return false;
            } else {
                Logger.instance().log(`Successfully message send to ${personPhone}`);
                await this.finishTask(true, userTask.id);
                return true;
            }
        }
        catch (error) {
            Logger.instance().log(`Error sending user task on bot: ${JSON.stringify(error.message, null, 2)}`);
        }
        return true;
    };

    private async getUserDetails(userId: string, channel: string) {
        let personPhone = '';
        const user = await this._userRepo.getById(userId);
        const person = await this._personRepo.getById(user.PersonId);
        if (channel === NotificationChannel.Telegram) {
            personPhone = person.UniqueReferenceId;
        } else if (channel === NotificationChannel.WhatsApp ||
            channel === NotificationChannel.WhatsappWati ) {
            personPhone = person.Phone;
        }
        return personPhone;
    }

    private async finishTask(sent: boolean, userTaskId: uuid) {
        if (sent) {
            const userTaskRepo = Injector.Container.resolve<IUserTaskRepo>('IUserTaskRepo');
            const delivered = await userTaskRepo.finishTask(userTaskId);
            Logger.instance().log(delivered ? `Schedule marked as delivered` : `Schedule could not be marked as delivered`);
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
            !whatsappFormMetadata                       ||
            whatsappFormMetadata.Type !== 'template'    ||
            !whatsappFormMetadata.TemplateName
        ) {
            Logger.instance().log(`Whatsapp form metadata is not valid : ${JSON.stringify(whatsappFormMetadata)}`);
            throw new ApiError(400, `Whatsapp form metadata is not valid`);
        }
        return true;
        
    };
          
    private timer = ms => new Promise(res => setTimeout(res, ms));

}
