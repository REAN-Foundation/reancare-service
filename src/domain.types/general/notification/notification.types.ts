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

export enum NotificationChannel {
    Email      = 'Email',
    SMS        = 'SMS',
    WebPush    = 'WebPush',
    MobilePush = 'MobilePush',
    Webhook    = 'Webhook',
    WhatsApp   = 'WhatsApp',
    Telegram   = 'Telegram',
}

export const NotificationTypeList: NotificationType [] = [
    NotificationType.Info,
    NotificationType.Warning,
    NotificationType.Error
];

export const NotificationTargetList: NotificationTarget [] = [
    NotificationTarget.User,
    NotificationTarget.Tenant,
    NotificationTarget.UserGroup,
    NotificationTarget.System
];

export const NotificationChannelList: NotificationChannel [] = [
    NotificationChannel.Email,
    NotificationChannel.SMS,
    NotificationChannel.WebPush,
    NotificationChannel.MobilePush,
    NotificationChannel.Webhook,
    NotificationChannel.WhatsApp,
    NotificationChannel.Telegram,
];

///////////////////////////////////////////////////////////////////////////

export interface NotificationCreateModel {
    id?             : uuid;
    TenantId       ?: uuid;
    Target          : NotificationTarget;
    Type            : NotificationType;
    Channel         : NotificationChannel;
    Title?          : string;
    Body?           : string;
    Payload?        : string;
    ImageUrl       ?: string;
    SentOn?         : Date;
    CreatedByUserId?: uuid;
}

export interface NotificationUpdateModel {
    id?      : uuid;
    TenantId?: uuid;
    Target?  : NotificationTarget;
    Type?    : NotificationType;
    Channel? : NotificationChannel;
    Title?   : string;
    Body?    : string;
    Payload? : string;
    ImageUrl?: string;
    SentOn?  : Date;
}

export interface NotificationDto {
    id?             : uuid;
    TenantId       ?: uuid;
    Target?         : NotificationTarget;
    Type?           : NotificationType;
    Channel?        : NotificationChannel;
    Title?          : string;
    Body?           : string;
    Payload?        : string;
    ImageUrl       ?: string;
    SentOn?         : Date;
    CreatedByUserId?: uuid;
    CreatedAt?       : Date;
    UpdatedAt?       : Date;
    DeletedAt?: Date;
}

export interface NotificationSearchFilters extends BaseSearchFilters{
    UserId  ?: string;
    TenantId?: string;
    Title?   : string;
    Target?  : NotificationTarget;
    Type?    : NotificationType;
    Channel? : NotificationChannel;
    SentOn  ?: Date;
    ReadOn  ?: Date;
}

export interface NotificationSearchResults extends BaseSearchResults{
    Items: NotificationDto[];
}

//////////////////////////////////////////////////////////////////////

export interface UserNotification {
    id           ?: uuid;
    UserId        : uuid;
    NotificationId: uuid;
    ReadOn?       : Date;
}

export interface NotificationDomainModel {
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
