
import { NotificationChannel, NotificationDto, NotificationTarget, NotificationType } from "../../../../../domain.types/general/notification/notification.types";
import NotificationModel from '../../models/general/notification/notification.model';

///////////////////////////////////////////////////////////////////////////////////

export class NotificationMapper {

    static toDto = (
        notification: NotificationModel): NotificationDto => {
        if (notification == null) {
            return null;
        }
        const dto: NotificationDto = {
            id              : notification.id,
            TenantId        : notification.TenantId,
            Target          : notification.Target as NotificationTarget,
            Type            : notification.Type as NotificationType,
            Channel         : notification.Channel as NotificationChannel,
            Title           : notification.Title,
            Body            : notification.Body,
            Payload         : notification.Payload,
            SentOn          : notification.SentOn,
            ImageUrl        : notification.ImageUrl,
            CreatedByUserId : notification.CreatedByUserId,
            CreatedAt       : notification.createdAt,
            UpdatedAt       : notification.updatedAt,
        };
        return dto;
    };

}
