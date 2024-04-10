import { INotificationRepo } from "../../database/repository.interfaces/general/notification.repo.interface";
import { 
    NotificationCreateModel, 
    NotificationDto, 
    NotificationUpdateModel, 
    NotificationSearchResults, 
    NotificationSearchFilters 
} from "../../domain.types/general/notification/notification.types";
import { inject, injectable } from "tsyringe";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class NotificationService {

    constructor(
        @inject('INotificationRepo') private _notificationRepo: INotificationRepo,
    ) {}

    create = async (notificationDomainModel: NotificationCreateModel ): Promise<NotificationDto> => {
        return await this._notificationRepo.create(notificationDomainModel);
    };

    getById = async (id: string): Promise<NotificationDto> => {
        return await this._notificationRepo.getById(id);
    };

    markAsRead = async (id: string, notificatioId: string): Promise<NotificationDto> => {
        return await this._notificationRepo.markAsRead(id, notificatioId);
    };

    search = async (filters: NotificationSearchFilters): Promise<NotificationSearchResults> => {
        return await this._notificationRepo.search(filters);
    };

    update = async (id: string, notificationDomainModel: NotificationUpdateModel): Promise<NotificationDto> => {
        return await this._notificationRepo.update(id, notificationDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._notificationRepo.delete(id);
    };

    sendToUser = async (id: string, userId: string) => {
        throw new Error('Method not implemented.');
    };

    getUserNotification = async (id: string, userId: string) => {
        throw new Error('Method not implemented.');
    };


}
