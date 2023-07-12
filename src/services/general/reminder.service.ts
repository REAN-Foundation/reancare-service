import { inject, injectable } from "tsyringe";
import { IReminderRepo } from "../../database/repository.interfaces/general/reminder.repo.interface";
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
    ) {}

    create = async (reminderDomainModel: ReminderDomainModel): Promise<ReminderDto> => {
        return await this._reminderRepo.create(reminderDomainModel);
    };

    getById = async (id: string): Promise<ReminderDto> => {
        return await this._reminderRepo.getById(id);
    };

    search = async (filters: ReminderSearchFilters): Promise<ReminderSearchResults> => {
        return await this._reminderRepo.search(filters);
    };

    update = async (id: string, reminderDomainModel: ReminderDomainModel): Promise<ReminderDto> => {
        return await this._reminderRepo.update(id, reminderDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._reminderRepo.delete(id);
    };

}
