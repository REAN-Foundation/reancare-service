export enum TenantSettingsTypes {
    HealthcareInterfaces = 'HealthcareInterfaces',
    Common              = 'Common',
    PatientApp          = 'PatientApp',
    ChatBot             = 'ChatBot',
    Forms               = 'Forms'
}

export const TenantSettingsTypesList = [
    TenantSettingsTypes.HealthcareInterfaces,
    TenantSettingsTypes.Common,
    TenantSettingsTypes.PatientApp,
    TenantSettingsTypes.ChatBot,
    TenantSettingsTypes.Forms
];

export interface HealthcareInterfaces {
    PatientApp: boolean,
    ChatBot   : boolean,
    Forms     : boolean
}

export interface ClinicalFeatures {
    Vitals     : boolean;
    LabRecords : boolean;
    Medications: boolean;
    Careplans  : {
        Default: boolean;
        Custom : boolean;
    };
    PatientStatusReports: true;
    AppointmentReminders: boolean;
    ScheduledAssesments : boolean;
    DocumentsManagement : boolean;
}

export interface ExternalIntegrations {
    FHIRStorage    : boolean;
    EHIRIntegration: boolean;
    ABDMIntegration: boolean;
}

export interface DeviceIntegration {
    Terra    : boolean;
    SenseSemi: boolean;
}

export interface AddOnFeatures {
    Gamification            : boolean,
    LearningJourney         : boolean,
    Community               : boolean,
    PatientSelfServicePortal: boolean;
}

export interface CommonSettings {
    Clinical : ClinicalFeatures;
    External : ExternalIntegrations;
    AddOns   : AddOnFeatures;
}

export interface PatientAppSettings {
    Excercise        : boolean;
    Nutrition        : boolean;
    DeviceIntegration: DeviceIntegration,
    Community        : boolean,
}

export interface MessageChannels {
    WhatsApp: boolean;
    Telegram: boolean;
}

export interface SupportChannels {
    ClickUp: boolean;
    Slack  : boolean;
    Email  : boolean;
}

export interface ChatBotSettings {
    Name               : string;
    Icon               : string;
    Description        : string;
    DefaultLanguage    : string;
    MessageChannels    : MessageChannels;
    SupportChannels    : SupportChannels;
    QuicksightDashboard: boolean,
    Personalization    : boolean,
    LocationContext    : boolean,
    Localization       : boolean,
}

export interface FormsIntegrations {
    KoboToolbox: boolean;
    ODK        : boolean;
    GoogleForm : boolean;
}

export interface FormsSettings {
        Integrations  : FormsIntegrations,
        OfflineSupport: boolean,
        FieldApp      : boolean
}

export interface TenantSettingsDomainModel {
    HealthcareInterfaces : HealthcareInterfaces,
    Common               : CommonSettings,
    PatientApp           : PatientAppSettings,
    ChatBot              : ChatBotSettings,
    Forms                : FormsSettings
}

export interface TenantSettingsDto extends TenantSettingsDomainModel {
    TenantId ?: string;
}
