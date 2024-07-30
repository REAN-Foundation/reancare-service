import { inject, injectable } from "tsyringe";
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

////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    public sendUserTasks = async (timePeriod: number) => {
        try {
            const userTasks = await this._userTaskRepo.getUserTasksOfSelectiveChannel(timePeriod);
            if (!userTasks || userTasks.length === 0) {
                return;
            }
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

    private sendUserTaskOnBot = async (userId: string, userTask): Promise<boolean> => {
        try {
            const personPhone = await this.getUserDetails(userId, userTask.Channel);

            let messageType = '';
            let message = '';

            const careplanActivity = await this._careplanRepo.getActivity(userTask.ActionId);
            const rawContent = JSON.parse(careplanActivity.RawContent);
            if (userTask.Category === UserTaskCategory.Assessment) {
                const entity = {
                    PatientUserId        : userTask.UserId ?? null,
                    AssessmentTemplateId : rawContent.ReferenceTemplateId ?? null,
                    UserTaskId           : userTask.id,
                    ScheduledDateString  : new Date().toISOString()
                        .split('T')[0] ?? null,
                };
                const assessment = await this._assessmentService.create(entity);
                userTask["Action"] = { Assessment: assessment };
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
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
        return true;
    };

    private async getUserDetails(userId: string, channel: string) {
        let personPhone = '';
        const user = await this._userRepo.getById(userId);
        const person = await this._personRepo.getById(user.PersonId);
        if (channel === NotificationChannel.Telegram) {
            personPhone = person.TelegramChatId;
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

    private timer = ms => new Promise(res => setTimeout(res, ms));

}
