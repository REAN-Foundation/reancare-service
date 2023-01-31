import { INotificationRepo } from "../../database/repository.interfaces/general/notification.repo.interface";
import { NotificationDto } from "../../domain.types/general/notification/notification.dto";
import { NotificationDomainModel } from "../../domain.types/general/notification/notification.domain.model";
import { NotificationSearchResults } from "../../domain.types/general/notification/notification.search.types";
import { NotificationSearchFilters } from "../../domain.types/general/notification/notification.search.types";
import { inject, injectable } from "tsyringe";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class NotificationService {

    constructor(
        @inject('INotificationRepo') private _notificationRepo: INotificationRepo,
    ) {}

    create = async (notificationDomainModel: NotificationDomainModel ): Promise<NotificationDto> => {
        return await this._notificationRepo.create(notificationDomainModel);
    };

    getById = async (id: string): Promise<NotificationDto> => {
        return await this._notificationRepo.getById(id);
    };

    markAsRead = async (id: string, notificationDomainModel: NotificationDomainModel): Promise<NotificationDto> => {
        return await this._notificationRepo.markAsRead(id, notificationDomainModel);
    };

    search = async (filters: NotificationSearchFilters): Promise<NotificationSearchResults> => {
        return await this._notificationRepo.search(filters);
    };

    update = async (id: string, notificationDomainModel: NotificationDomainModel): Promise<NotificationDto> => {
        return await this._notificationRepo.update(id, notificationDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._notificationRepo.delete(id);
    };

}
