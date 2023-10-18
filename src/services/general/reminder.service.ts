import { inject, injectable } from "tsyringe";
import { IReminderRepo } from "../../database/repository.interfaces/general/reminder.repo.interface";
import { IReminderScheduleRepo } from "../../database/repository.interfaces/general/reminder.schedule.repo.interface";
import {
    ReminderDomainModel,
    ReminderDto,
    ReminderSearchResults,
    ReminderSearchFilters
} from '../../domain.types/general/reminder/reminder.domain.model';
import { Logger } from "../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ReminderService {

    constructor(
        @inject('IReminderRepo') private _reminderRepo: IReminderRepo,
        @inject('IReminderScheduleRepo') private _reminderScheduleRepo: IReminderScheduleRepo,
    ) {}

    create = async (reminderDomainModel: ReminderDomainModel): Promise<ReminderDto> => {
        const reminder = await this._reminderRepo.create(reminderDomainModel);
        var schedules = await this._reminderScheduleRepo.createSchedules(reminder);
        schedules = schedules.filter(x => x !== null);
        const delivered = schedules?.filter(x => x?.IsDelivered === true);
        const pending = schedules?.filter(x => x?.IsDelivered === false);
        reminder.DeliveredSchedules = delivered?.length;
        reminder.PendingSchedules = pending?.length;
        reminder.Schedules = schedules?.map(x => {
            return {
                id       : x.id,
                Schedule : x.Schedule,
            };
        });
        return reminder;
    };

    getById = async (id: string): Promise<ReminderDto> => {
        const reminder = await this._reminderRepo.getById(id);
        const schedules = await this._reminderScheduleRepo.createSchedules(reminder);
        const delivered = schedules?.filter(x => x?.IsDelivered === true);
        const pending = schedules?.filter(x => x?.IsDelivered === false);
        reminder.DeliveredSchedules = delivered?.length;
        reminder.PendingSchedules = pending?.length;
        return reminder;
    };

    search = async (filters: ReminderSearchFilters): Promise<ReminderSearchResults> => {
        return await this._reminderRepo.search(filters);
    };

    delete = async (id: string): Promise<boolean> => {
        const deletedScedules = await this._reminderScheduleRepo.deleteSchedulesForReminder(id);
        Logger.instance().log(`Deleted ${deletedScedules} schedules for reminder ${id}`);
        const deleted = await this._reminderRepo.delete(id);
        return deleted;
    };

    getRemindersForUser = async (userId: string): Promise<ReminderDto[]> => {
        return await this._reminderRepo.getRemindersForUser(userId);
    };

    deleteRemindersForUser = async (userId: string): Promise<boolean> => {
        return await this._reminderRepo.deleteRemindersForUser(userId);
    };

}
