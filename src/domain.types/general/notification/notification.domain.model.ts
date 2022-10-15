import { uuid } from "../../miscellaneous/system.types";

export interface NotificationDomainModel {
    id?            : uuid;
    UserId?        : uuid;
    Title?         : string;
    Body?          : string;
    Payload?       : string;
    ImageUrl?      : string;
    Type?          : string;
    SentOn?        : Date;
    ReadOn?        : Date;
}
