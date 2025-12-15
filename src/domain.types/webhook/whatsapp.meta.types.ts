export type GenericChannelConfig = Record<string, any>;

export interface WhatsAppConfig {
    FlowToken?: string;
    FlowActionData?: Record<string, any>;
}

export interface ChannelMetadata {
    Type: string;
    TemplateName: string;
    TemplateLanguage?: string;
    Channels?: {
        Email?: GenericChannelConfig;
        SMS?: GenericChannelConfig;
        WebPush?: GenericChannelConfig;
        MobilePush?: GenericChannelConfig;
        Webhook?: GenericChannelConfig;
        WhatsApp?: WhatsAppConfig;
        Telegram?: GenericChannelConfig;
        Slack?: GenericChannelConfig;
        WhatsappWati?: GenericChannelConfig;
        whatsappMeta?: GenericChannelConfig;
    };
}

export interface WhatsAppFlowTemplateRequest {
    Type: string;
    TemplateName: string;
    TemplateLanguage?: string;
    FlowToken?: string;
    FlowActionData?: Record<string, any>;
}

