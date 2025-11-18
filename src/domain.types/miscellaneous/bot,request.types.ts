import { NotificationChannel } from "../general/notification/notification.types";

export interface BotRequestDomainModel {
    PhoneNumber: string;
    PlatformId?: string;
    Channel: NotificationChannel;
    ClientName?: string;
    AgentName?: string;
    Provider?: string;
    Type: BotMessagingType;
    TemplateName?: string;
    Message: string;
    Payload?: Record<string, any>;
}

export enum BotMessagingType {
    Template = "template",
    Text = "text",
    Image = "image",
    Video = "video",
    Audio = "audio",
    File = "file",
}
