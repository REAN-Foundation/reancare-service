import { Logger } from "../../../common/logger";
import { Loader } from "../../../startup/loader";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import dayjs = require("dayjs");
import * as asyncLib from 'async';
import { IUserTaskRepo } from "../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { ICareplanRepo } from '../../../database/repository.interfaces/clinical/careplan.repo.interface';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { MessagingService } from "../../../modules/communication/messaging.service/messaging.service";
import { UserActionResolver } from "./user.action.resolver";

////////////////////////////////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT = 4;

export class UserTaskSenderService {

    static _q = asyncLib.queue((timePeriod: number, onCompleted) => {
        (async () => {
            await UserTaskSenderService.send(timePeriod);
            onCompleted();
        })();
    }, ASYNC_TASK_COUNT);

    static sendUserTasks = async (timePeriodMin: number) => {
        try {
            UserTaskSenderService.enqueue(timePeriodMin);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    //#region Privates

    private static enqueue = (timePeriod: number) => {
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

    private static send = async (timePeriod: number) => {
        try {
            const careplanRepo = Loader.container.resolve<ICareplanRepo>('ICareplanRepo');
            const careplanActivities = await careplanRepo.getUserTasksOfSelectiveProvider(timePeriod);
            if (!careplanActivities || careplanActivities.length === 0) {
                return;
            }
            for await (const activity of careplanActivities) {
                const user = activity.User;
                const provider = activity.Provider;

                if (provider === 'REAN') {
                    const userTaskRepo = Loader.container.resolve<IUserTaskRepo>('IUserTaskRepo');
                    const userTaskAssessment = await userTaskRepo.getById(activity.UserTaskId);
                    if (userTaskAssessment.ActionId != null && userTaskAssessment.ActionType !== null) {
                        var actionResolver = new UserActionResolver();
                        const action = await actionResolver.getAction(userTaskAssessment.ActionType, 
                            userTaskAssessment.ActionId);
                        if (action) {
                            userTaskAssessment['Action'] = action;
                        }
                    }
                    await this.sendReminderByWebhook(user, userTaskAssessment);
                    await UserTaskSenderService.timer(500);
                }
                else {
                    continue;
                }
            }
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    private static sendReminderByWebhook = async (user, userTaskAssessment): Promise<boolean> => {
        try {
            const {personPhone, message } = await UserTaskSenderService.getUserDetails(user);

            const payload = JSON.stringify(userTaskAssessment);
            const booleanResponse = await Loader.messagingService.sendWhatsappWithReanBot(personPhone, message,
                userTaskAssessment.Action.Provider, "reancareAssessment", null, payload);
            if (!booleanResponse) {
                throw new Error(`Something went wrong with rean bot wrapper`);
            }
            Logger.instance().log(`Successfully whatsapp message send to ${personPhone}`);
            await UserTaskSenderService.finishTask(true, userTaskAssessment.UserTaskId);
            return true;
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
        return true;
    };

    private static async getUserDetails(user: any ) {
        const personRepo = Loader.container.resolve<IPersonRepo>('IPersonRepo');
        const person = await personRepo.getById(user.PersonId);
        const personPhone = person.Phone;
        const message  = '{"message": "Sending assessment to Rean bot"}';
        return { personPhone, message };
    }

    private static async finishTask(sent: boolean, userTaskId: uuid) {
        if (sent) {
            const userTaskRepo = Loader.container.resolve<IUserTaskRepo>('IUserTaskRepo');
            const delivered = await userTaskRepo.finishTask(userTaskId);
            Logger.instance().log(delivered ? `Schedule marked as delivered` : `Schedule could not be marked as delivered`);
        }
    }

    private static timer = ms => new Promise(res => setTimeout(res, ms));

    private getClientByProvider (provider) {
        const clientName = {
            "REAN_BW"       : "BLOOD_WARRIORS",
            "REAN"          : "MATERNAL_BOT",
            "REAN_REMINDER" : "REAN_BOT",
        };
        return clientName[provider] ?? "DEFAULT";
    }

}