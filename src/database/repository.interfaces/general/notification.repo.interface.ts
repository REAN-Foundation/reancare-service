import { NotificationDomainModel } from "../../../domain.types/general/notification/notification.domain.model";
import { NotificationDto } from "../../../domain.types/general/notification/notification.dto";
import { NotificationSearchResults } from "../../../domain.types/general/notification/notification.search.types";
import { NotificationSearchFilters } from "../../../domain.types/general/notification/notification.search.types";

export interface INotificationRepo {

    create(notificationDomainModel: NotificationDomainModel): Promise<NotificationDto>;

    getById(id: string): Promise<NotificationDto>;

    markAsRead(id: string, notificationDomainModel: NotificationDomainModel): Promise<NotificationDto>;
    
    search(filters: NotificationSearchFilters): Promise<NotificationSearchResults>;

    update(id: string, notificationDomainModel: NotificationDomainModel): Promise<NotificationDto>;

    delete(id: string): Promise<boolean>;

}
