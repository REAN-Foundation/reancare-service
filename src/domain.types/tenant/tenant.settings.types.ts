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
    Vitals              : boolean;
    LabRecords          : boolean;
    Symptoms            : boolean;
    DrugsManagement     : boolean;
    Medications         : boolean;
    Careplans           : boolean;
    Assessments         : boolean;
}

export interface ExternalIntegrations {
    FHIRStorage    : boolean;
    EHRIntegration : boolean;
    ABDMIntegration: boolean;
}

export interface DeviceIntegration {
    Terra    : boolean;
    SenseSemi: boolean;
}

export interface AddOnFeatures {
    HospitalSystems         : boolean,
    Gamification            : boolean,
    LearningJourney         : boolean,
    Community               : boolean,
    PatientSelfServicePortal: boolean;
    PatientStatusReports    : boolean;
    DocumentsManagement     : boolean;
    AppointmentReminders    : boolean;
    Organizations           : boolean;
    Cohorts                 : boolean;
    Notifications           : boolean;
    Newsfeeds               : boolean;
    Notices                 : boolean;
}

export interface AnalysisSettings {
    CustomQueries: boolean;
    Quicksight   : boolean;
}

export interface CommonSettings {
    Clinical : ClinicalFeatures;
    External : ExternalIntegrations;
    AddOns   : AddOnFeatures;
    Analysis : AnalysisSettings;
}

export interface PatientAppSettings {
    Excercise        : boolean;
    Nutrition        : boolean;
    DeviceIntegration: DeviceIntegration,
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
