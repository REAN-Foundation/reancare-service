import {
    ReminderDomainModel,
    ReminderDto,
    ReminderSearchFilters,
    ReminderSearchResults
} from "../../../domain.types/general/reminder/reminder.domain.model";

export interface IReminderRepo {

    create(reminderDomainModel: ReminderDomainModel): Promise<ReminderDto>;

    getById(id: string): Promise<ReminderDto>;

    search(filters: ReminderSearchFilters): Promise<ReminderSearchResults>;

    delete(id: string): Promise<boolean>;

    getRemindersForUser(userId: string): Promise<ReminderDto[]>;

    deleteRemindersForUser(userId: string): Promise<boolean>;

}
