import { IReminderScheduleRepo } from "../../database/repository.interfaces/general/reminder.schedule.repo.interface";
import {
    NotificationType
} from '../../domain.types/general/reminder/reminder.domain.model';
import { Logger } from "../../common/logger";
import * as asyncLib from 'async';
import needle = require('needle');
import axios from 'axios';
import { Loader } from "../../startup/loader";

////////////////////////////////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT = 4;

export class ReminderSenderService {

    static _q = asyncLib.queue((timePeriod: number, onCompleted) => {
        (async () => {
            await ReminderSenderService.send(timePeriod);
            onCompleted();
        })();
    }, ASYNC_TASK_COUNT);

    static sendReminders = async (timePeriodMin: number) => {
        try {
            ReminderSenderService.enqueue(timePeriodMin);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    private static enqueue = (timePeriod: number) => {
        this._q.push(timePeriod, (model, error) => {
            if (error) {
                Logger.instance().log(`Error sending reminders: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error sending reminders: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Recorded Awards Facts: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    private static send = async (timePeriod: number) => {
        try {
            const scheduleRepo = Loader.container.resolve<IReminderScheduleRepo>('IReminderScheduleRepo');
            const schedules = await scheduleRepo.getRemindersForNextNMinutes(timePeriod);
            if (!schedules || schedules.length === 0) {
                return;
            }
            for await (const schedule of schedules) {
                const user = schedule.User;
                const reminder = schedule.Reminder;
                const notificationType = reminder.NotificationType;

                if (notificationType === NotificationType.Email) {
                    await this.sendReminderByEmail(user, reminder, schedule);
                }
                else if (notificationType === NotificationType.SMS) {
                    await this.sendReminderBySMS(user, reminder, schedule);
                }
                else if (notificationType === NotificationType.WhatsApp) {
                    await this.sendReminderByWhatsApp(user, reminder, schedule);
                }
                else if (notificationType === NotificationType.Webhook) {
                    await this.sendReminderByWebhook(user, reminder, schedule);
                }
                else {
                    continue;
                }
            }
            // const url = `http://localhost:3000/api/v1/reminder/sender/${timePeriod}`;
            // const response = await axios.get(url);
            // Logger.instance().log(JSON.stringify(response.data, null, 2));
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    static sendReminderBySMS = async (user, reminder, schedule): Promise<boolean> => {
        throw new Error('Method not implemented.');
    };

    static sendReminderByWhatsApp = async (user, reminder, schedule): Promise<boolean> => {
        throw new Error('Method not implemented.');
    };

    static sendReminderByEmail = async (user, reminder, schedule): Promise<boolean> => {
        throw new Error('Method not implemented.');
    };

    static sendReminderByWebhook = async (user, reminder, schedule): Promise<boolean> => {
        throw new Error('Method not implemented.');
    };

}
