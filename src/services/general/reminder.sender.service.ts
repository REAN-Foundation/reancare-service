import { IReminderScheduleRepo } from "../../database/repository.interfaces/general/reminder.schedule.repo.interface";
import {
    NotificationType
} from '../../domain.types/general/reminder/reminder.domain.model';
import { Logger } from "../../common/logger";
import { Loader } from "../../startup/loader";
import { IPersonRepo } from "../../database/repository.interfaces/person/person.repo.interface";
import { EmailService } from "../../modules/communication/email/email.service";
import { EmailDetails } from "../../modules/communication/email/email.details";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import dayjs = require("dayjs");
import * as asyncLib from 'async';
import axios from 'axios';
import { IUserDeviceDetailsRepo } from "../../database/repository.interfaces/users/user/user.device.details.repo.interface ";
import { INotificationService } from "../../modules/communication/notification.service/notification.service.interface";
import { TimeHelper } from "../../common/time.helper";

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
                else if (notificationType === NotificationType.Webhook) {
                    await this.sendReminderByWebhook(user, reminder, schedule);
                }
                else if (notificationType === NotificationType.MobilePush) {
                    await this.sendReminderByMobilePush(user, reminder, schedule);
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

    private static sendReminderBySMS = async (user, reminder, schedule): Promise<boolean> => {
        const { messagingService, phone, message } =
            await ReminderSenderService.getUserSMSDetails(user, reminder, schedule);
        const sent = await messagingService.sendSMS(phone, message);
        await ReminderSenderService.markAsDelivered(sent, schedule.id);
        return true;
    };

    private static sendReminderByWhatsApp = async (user, reminder, schedule): Promise<boolean> => {
        const { messagingService, phone, message, templateName } =
            await ReminderSenderService.getUserWhatsAppDetails(user, reminder, schedule);
        const sent = await messagingService.sendWhatsappWithReanBot(phone, message, "REAN_REMINDER",
            templateName, null, null);
        await ReminderSenderService.markAsDelivered(sent, schedule.id);
        return true;
    };

    private static sendReminderByEmail = async (user, reminder, schedule): Promise<boolean> => {
        const { emailService, emailDetails }
            = await ReminderSenderService.getUserEmailDetails(user, reminder, schedule);
        const sent = await emailService.sendEmail(emailDetails, false);
        await ReminderSenderService.markAsDelivered(sent, schedule.id);
        return true;
    };

    private static sendReminderByWebhook = async (user, reminder, schedule): Promise<boolean> => {
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

    private static sendReminderByMobilePush = async (user, reminder, schedule): Promise<boolean> => {
        const { notificationService, deviceTokens, message } =
            await ReminderSenderService.getUserMobilePushDetails(user, reminder, schedule);
        for await (const deviceToken of deviceTokens) {
            await notificationService.sendNotificationToDevice(deviceToken, message);
        }
        await ReminderSenderService.markAsDelivered(true, schedule.id);
        return true;
    };

    private static async markAsDelivered(sent: boolean, scheduleId: uuid) {
        if (sent) {
            const scheduleRepo = Loader.container.resolve<IReminderScheduleRepo>('IReminderScheduleRepo');
            const delivered = await scheduleRepo.markAsDelivered(scheduleId);
            Logger.instance().log(delivered ? `Schedule marked as delivered` : `Schedule could not be marked as delivered`);
        }
    }

    private static async getUserSMSDetails(user: any, reminder: any, schedule: any) {
        const personRepo = Loader.container.resolve<IPersonRepo>('IPersonRepo');
        const messagingService = Loader.messagingService;
        const person = await personRepo.getById(user.PersonId);
        const phone = person.Phone;
        const message = ReminderSenderService.constructMessage(schedule, reminder);
        return { messagingService, phone, message };
    }

    private static async getUserWhatsAppDetails(user: any, reminder: any, schedule: any) {
        const personRepo = Loader.container.resolve<IPersonRepo>('IPersonRepo');
        const messagingService = Loader.messagingService;
        const person = await personRepo.getById(user.PersonId);
        const phone = person.Phone;
        const { message, templateName } = ReminderSenderService.constructWhatsAppTemplateMessage(schedule, reminder);
        return { messagingService, phone, message, templateName };
    }

    private static constructWhatsAppTemplateMessage(schedule: any, reminder: any) {
        const duration = dayjs.duration(dayjs(schedule.Schedule).diff(dayjs()));
        const minutes = Math.ceil(duration.asMinutes());
        Logger.instance().log(`Sending reminder for ${dayjs(schedule.Schedule).format('hh:mm:ss')}`);

        // Creating variables for template
        const messageData = { TemplateName: "",Variables: {} };
        const templateData = JSON.parse(JSON.parse(reminder.RawContent));
        messageData.TemplateName = templateData.TemplateName;
        templateData.Variables.en[1].text = minutes;
        templateData.Variables.en[2].text = dayjs(schedule.Schedule).format('hh:mm:ss');
        messageData.Variables = JSON.stringify(templateData.Variables);
        const message = JSON.stringify(messageData);
        const templateName = templateData.TemplateName;

        return { message, templateName };
    }

    private static constructMessage(schedule: any, reminder: any) {
        const duration = dayjs.duration(dayjs(schedule.Schedule).diff(dayjs()));
        const minutes = Math.ceil(duration.asMinutes());
        Logger.instance().log(`Sending reminder for ${TimeHelper.formatTimeTo_HH_MM_A(reminder.WhenTime)}`);
        const message = `${reminder.Name} in ${minutes} minutes at ${TimeHelper.formatTimeTo_HH_MM_A(reminder.WhenTime)}.`;
        Logger.instance().log(message);
        return message;
    }

    private static async getUserMobilePushDetails(user: any, reminder: any, schedule: any) {
        const userDeviceDetailsRepo = Loader.container.resolve<IUserDeviceDetailsRepo>('IUserDeviceDetailsRepo');
        const notificationService = Loader.container.resolve<INotificationService>('INotificationService');
        const deviceDetails = await userDeviceDetailsRepo.getByUserId(user.id);
        if (!deviceDetails || deviceDetails.length === 0) {
            throw new Error(`Device details not found for user ${user.id}`);
        }
        const deviceTokens = deviceDetails.map(x => x.Token);
        const message = ReminderSenderService.constructMessage(schedule, reminder);
        return { notificationService, deviceTokens, message };
    }

    private static async getUserEmailDetails(user: any, reminder: any, schedule: any) {
        const personRepo = Loader.container.resolve<IPersonRepo>('IPersonRepo');
        const emailService = new EmailService();
        const person = await personRepo.getById(user.PersonId);
        if (!person.Email) {
            throw new Error(`Email address not found for user ${user.PersonId}`);
        }
        var body = await emailService.getTemplate('reminder.template.html');
        body.replace('{{TITLE}}', reminder.Name);
        body.replace('{{SCHEDULE_TIME}}', dayjs(schedule.Schedule).format(`L LT`));
        const emailDetails: EmailDetails = {
            EmailTo : person.Email,
            Subject : `Reminder for ${reminder.Name}`,
            Body    : body,
        };
        return { emailService, emailDetails };
    }

    private static async getWebhookDetails(user: any, reminder: any, schedule: any) {
        const personRepo = Loader.container.resolve<IPersonRepo>('IPersonRepo');
        const person = await personRepo.getById(user.PersonId);
        const message = ReminderSenderService.constructMessage(schedule, reminder);
        const payload = {
            title   : reminder.Name,
            message : message,
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
