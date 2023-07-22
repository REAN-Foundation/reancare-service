import { IReminderScheduleRepo } from "../../database/repository.interfaces/general/reminder.schedule.repo.interface";
import {
    NotificationType
} from '../../domain.types/general/reminder/reminder.domain.model';
import { Logger } from "../../common/logger";
import { Loader } from "../../startup/loader";
import { IPersonRepo } from "../../database/repository.interfaces/person/person.repo.interface";
import { MessagingService } from "../../modules/communication/messaging.service/messaging.service";
import { EmailService } from "../../modules/communication/email/email.service";
import { EmailDetails } from "../../modules/communication/email/email.details";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import dayjs = require("dayjs");
import * as asyncLib from 'async';
import axios from 'axios';

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

                if (notificationType === NotificationType.SMS) {
                    await this.sendReminderBySMS(user, reminder, schedule);
                }
                else if (notificationType === NotificationType.WhatsApp) {
                    await this.sendReminderByWhatsApp(user, reminder, schedule);
                }
                else if (notificationType === NotificationType.Email) {
                    await this.sendReminderByEmail(user, reminder, schedule);
                }
                // else if (notificationType === NotificationType.Webhook) {
                //     await this.sendReminderByWebhook(user, reminder, schedule);
                // }
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
        const { messagingService, phone, message } =
            await ReminderSenderService.getUserMessageDetails(user, reminder, schedule);
        const sent = await messagingService.sendSMS(phone, message);
        await ReminderSenderService.markAsDelivered(sent, schedule.id);
        return true;
    };

    static sendReminderByWhatsApp = async (user, reminder, schedule): Promise<boolean> => {
        const { messagingService, phone, message } =
            await ReminderSenderService.getUserMessageDetails(user, reminder, schedule);
        const sent = await messagingService.sendWhatsappMessage(phone, message);
        await ReminderSenderService.markAsDelivered(sent, schedule.id);
        return true;
    };

    static sendReminderByEmail = async (user, reminder, schedule): Promise<boolean> => {
        const { emailService, emailDetails }
            = await ReminderSenderService.getUserEmailDetails(user, reminder, schedule);
        const sent = await emailService.sendEmail(emailDetails, false);
        await ReminderSenderService.markAsDelivered(sent, schedule.id);
        return true;
    };

    static sendReminderByWebhook = async (user, reminder, schedule): Promise<boolean> => {
        try {
            const { payload, headers, url } = await ReminderSenderService.getWebhookDetails(user, reminder, schedule);
            const response = await axios.post(url, payload, { headers });
            Logger.instance().log(response.data);
            if (response.status !== 200 && response.status !== 201) {
                throw new Error(`Webhook returned status code ${response.status}`);
            }
            await ReminderSenderService.markAsDelivered(true, schedule.id);
            return true;
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
        return true;
    };

    private static async markAsDelivered(sent: boolean, scheduleId: uuid) {
        if (sent) {
            const scheduleRepo = Loader.container.resolve<IReminderScheduleRepo>('IReminderScheduleRepo');
            const delivered = await scheduleRepo.markAsDelivered(scheduleId);
            Logger.instance().log(delivered ? `Schedule marked as delivered` : `Schedule could not be marked as delivered`);
        }
    }

    private static async getUserMessageDetails(user: any, reminder: any, schedule: any) {
        const scheduleRepo = Loader.container.resolve<IPersonRepo>('IPersonRepo');
        const messagingService = Loader.container.resolve<MessagingService>('MessagingService');
        const person = await scheduleRepo.getById(user.PersonId);
        const phone = person.Phone;
        const message = `You have a reminder: ${reminder.Title} set at ${dayjs(schedule.Schedule).format(`L LT`)}. Thank you.`;
        return { messagingService, phone, message };
    }

    private static async getUserEmailDetails(user: any, reminder: any, schedule: any) {
        const scheduleRepo = Loader.container.resolve<IPersonRepo>('IPersonRepo');
        const emailService = new EmailService();
        const person = await scheduleRepo.getById(user.PersonId);
        if (!person.Email) {
            throw new Error(`Email address not found for user ${user.PersonId}`);
        }
        var body = await emailService.getTemplate('reminder.template.html');
        body.replace('{{TITLE}}', reminder.Title);
        body.replace('{{SCHEDULE_TIME}}', dayjs(schedule.Schedule).format(`L LT`));
        const emailDetails: EmailDetails = {
            EmailTo : person.Email,
            Subject : `Reminder for ${reminder.Title}`,
            Body    : body,
        };
        return { emailService, emailDetails };
    }

    private static async getWebhookDetails(user: any, reminder: any, schedule: any) {
        const scheduleRepo = Loader.container.resolve<IPersonRepo>('IPersonRepo');
        const person = await scheduleRepo.getById(user.PersonId);
        const payload = {
            title   : reminder.Title,
            message : `You have a reminder: ${reminder.Title} set at ${dayjs(schedule.Schedule).format(`L LT`)}. Thank you.`,
            UserId  : user.id,
            Phone   : person.Phone,
        };
        const headers = {
            'Content-Type' : 'application/json',
        };
        const url = reminder.HookUrl;
        return { payload, headers, url };
    }

}
