import {
    NotificationCreateModel,
    NotificationDto,
    NotificationSearchFilters,
    NotificationSearchResults,
    NotificationUpdateModel,
    UserNotificationDto
} from '../../../domain.types/general/notification/notification.types';

export interface INotificationRepo {

    create(notificationDomainModel: NotificationCreateModel): Promise<NotificationDto>;

    getById(id: string): Promise<NotificationDto>;

    search(filters: NotificationSearchFilters): Promise<NotificationSearchResults>;

    update(id: string, notificationDomainModel: NotificationUpdateModel): Promise<NotificationDto>;

    delete(id: string): Promise<boolean>;

    sendToUser(id: string, userId: string): Promise<boolean>;

    markAsRead(id: string, userId: string): Promise<boolean>;

    getUserNotification(id: string, userId: string): Promise<UserNotificationDto>;

}
