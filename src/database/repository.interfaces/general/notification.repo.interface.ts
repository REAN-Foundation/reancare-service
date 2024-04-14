import { NotificationDomainModel, NotificationDto, NotificationSearchFilters, NotificationSearchResults } from "../../../domain.types/general/notification/notification.types";

export interface INotificationRepo {

    create(notificationDomainModel: NotificationDomainModel): Promise<NotificationDto>;

    getById(id: string): Promise<NotificationDto>;

    markAsRead(id: string, notificationDomainModel: NotificationDomainModel): Promise<NotificationDto>;
    
    search(filters: NotificationSearchFilters): Promise<NotificationSearchResults>;

    update(id: string, notificationDomainModel: NotificationDomainModel): Promise<NotificationDto>;

    delete(id: string): Promise<boolean>;

}
