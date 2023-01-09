
import { NotificationDto } from "../../../../../domain.types/general/notification/notification.dto";
import NotificationModel from '../../models/general/notification.model';

///////////////////////////////////////////////////////////////////////////////////

export class NotificationMapper {

    static toDto = (
        notification: NotificationModel): NotificationDto => {
        if (notification == null) {
            return null;
        }
        const dto: NotificationDto = {
            id             : notification.id,
            UserId         : notification.UserId,
            BroadcastToAll : notification.BroadcastToAll,
            Title          : notification.Title,
            Body           : notification.Body,
            Payload        : notification.Payload,
            SentOn         : notification.SentOn,
            ReadOn         : notification.ReadOn,
            ImageUrl       : notification.ImageUrl,
            Type           : notification.Type,
        };
        return dto;
    };

}
