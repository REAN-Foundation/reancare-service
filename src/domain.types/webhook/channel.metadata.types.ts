import { NotificationChannel } from "../general/notification/notification.types";

///////////////////////////////////////////////////////////////////////////////

export type GenericChannelConfig = Record<string, any>;

export interface WhatsAppConfig {
    TemplateName?: string;
    TemplateLanguage?: string;
    FlowToken?: string;
    FlowActionData?: Record<string, any>;
}

export type ChannelConfigs = {
    [NotificationChannel.WhatsApp]?: WhatsAppConfig;
    [NotificationChannel.Telegram]?: GenericChannelConfig;
    [NotificationChannel.Email]?: GenericChannelConfig;
    [NotificationChannel.SMS]?: GenericChannelConfig;
    [NotificationChannel.WebPush]?: GenericChannelConfig;
    [NotificationChannel.MobilePush]?: GenericChannelConfig;
    [NotificationChannel.Webhook]?: GenericChannelConfig;
    [NotificationChannel.Slack]?: GenericChannelConfig;
    [NotificationChannel.WhatsappWati]?: GenericChannelConfig;
    [NotificationChannel.WhatsappMeta]?: GenericChannelConfig;
};

export interface ChannelMetadata {
    Type: string;
    Channels?: ChannelConfigs;
}

export interface WhatsAppFlowTemplateRequest {
    Type: string;
    TemplateName: string;
    TemplateLanguage?: string;
    FlowToken?: string;
    FlowActionData?: Record<string, any>;
}

