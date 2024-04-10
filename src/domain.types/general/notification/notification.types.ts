import { uuid } from "../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";

/////////////////////////////////////////////////////////////////////////// 

export enum NotificationType {
    Info    = 'Info',
    Warning = 'Warning',
    Error   = 'Error'
}

export enum NotificationTarget {
    User      = 'User',
    Tenant    = 'Tenant',
    UserGroup = 'UserGroup',
    System    = 'System'
}

export interface NotificationCreateModel {
    id?      : uuid;
    TenantId?: uuid;
    Target   : NotificationTarget;
    Type     : NotificationType;
    Title?   : string;
    Body?    : string;
    Payload? : string;
    ImageUrl?: string;
    SentOn?  : Date;
}

export interface NotificationUpdateModel {
    id?      : uuid;
    TenantId?: uuid;
    Target?  : NotificationTarget;
    Type?    : NotificationType;
    Title?   : string;
    Body?    : string;
    Payload? : string;
    ImageUrl?: string;
    SentOn?  : Date;
}

export interface NotificationDto {
    id?            : uuid;
    TenantId?      : uuid;
    BroadcastToAll?: boolean;
    Title?         : string;
    Body?          : string;
    Payload?       : string;
    ImageUrl?      : string;
    Type?          : string;
    SentOn?        : Date;
    ReadOn?        : Date;
    CreatedAt      : Date;
    UpdatedAt      : Date;
    DeletedAt     ?: Date;
}

export interface NotificationSearchFilters extends BaseSearchFilters{
    UserId  ?: string;
    TenantId?: string;
    Title?   : string;
    Type?    : string;
    SentOn  ?: Date;
    ReadOn  ?: Date;
}

export interface NotificationSearchResults extends BaseSearchResults{
    Items: NotificationDto[];
}

//////////////////////////////////////////////////////////////////////

export interface UserNotification {
    id            : uuid;
    UserId        : uuid;
    NotificationId: uuid;
    ReadOn?       : Date;
}
