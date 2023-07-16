import { inject, injectable } from "tsyringe";
import { IReminderRepo } from "../../database/repository.interfaces/general/reminder.repo.interface";
import { IReminderScheduleRepo } from "../../database/repository.interfaces/general/reminder.schedule.repo.interface";
import {
    ReminderDomainModel,
    ReminderDto,
    ReminderSearchResults,
    ReminderSearchFilters
} from '../../domain.types/general/reminder/reminder.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ReminderService {

    constructor(
        @inject('IReminderRepo') private _reminderRepo: IReminderRepo,
        @inject('IReminderScheduleRepo') private _reminderScheduleRepo: IReminderScheduleRepo,
    ) {}

    create = async (reminderDomainModel: ReminderDomainModel): Promise<ReminderDto> => {
        const reminder = await this._reminderRepo.create(reminderDomainModel);

        return reminder;
    };

    getById = async (id: string): Promise<ReminderDto> => {
        return await this._reminderRepo.getById(id);
    };

    search = async (filters: ReminderSearchFilters): Promise<ReminderSearchResults> => {
        return await this._reminderRepo.search(filters);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._reminderRepo.delete(id);
    };

    getRemindersForUser = async (userId: string): Promise<ReminderDto[]> => {
        return await this._reminderRepo.getRemindersForUser(userId);
    };

    deleteRemindersForUser = async (userId: string): Promise<boolean> => {
        return await this._reminderRepo.deleteRemindersForUser(userId);
    };

}
