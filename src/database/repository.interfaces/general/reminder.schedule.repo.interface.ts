import {
    ReminderDomainModel,
} from "../../../domain.types/general/reminder/reminder.domain.model";

export interface IReminderScheduleRepo {

    createSchedules(reminderDomainModel: ReminderDomainModel): Promise<any[]>;

    getById(id: string): Promise<any>;

    delete(id: string): Promise<boolean>;

    getSchedulesForUser(userId: string, from: Date, to: Date): Promise<any[]>;

    deleteSchedulesForReminder(reminderId: string): Promise<number>;

    deleteFutureSchedulesForReminder(reminderId: string): Promise<number>;

    deleteAllSchedulesForUser(userId: string): Promise<number>;

    getRemindersForNextNMinutes(timePeriod: number): Promise<any[]>;

    markAsDelivered(id: string): Promise<boolean>;

    markAsAcknowledged(id: string): Promise<boolean>;

}
