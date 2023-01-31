import { uuid } from "../../miscellaneous/system.types";

export interface NotificationDto{
    id?            : uuid;
    UserId?        : uuid;
    BroadcastToAll?: boolean;
    Title?         : string;
    Body?          : string;
    Payload?       : string;
    ImageUrl?      : string;
    Type?          : string;
    SentOn?        : Date;
    ReadOn?        : Date;
}
