export enum TenantSettingsTypes {
    UserInterfaces      = 'UserInterfaces',
    Common              = 'Common',
    PatientApp          = 'PatientApp',
    ChatBot             = 'ChatBot',
    Forms               = 'Forms'
}

export enum WeekDay {
    Sunday      = 'Sunday',
    Monday      = 'Monday',
    Tuesday     = 'Tuesday',
    Wednesday   = 'Wednesday',
    Thursday    = 'Thursday',
    Friday      = 'Friday',
    Saturday    = 'Saturday'
}

export const TenantSettingsTypesList = [
    TenantSettingsTypes.UserInterfaces,
    TenantSettingsTypes.Common,
    TenantSettingsTypes.PatientApp,
    TenantSettingsTypes.ChatBot,
    TenantSettingsTypes.Forms
];

export interface UserInterfaces {
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
    Exercise        : boolean;
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
    AppointmentFollowup: AppointmentFollowup
}

export interface AppointmentFollowup {
    UploadAppointmentDocument: boolean,
    AppointmentEhrApi: boolean,
    AppointmentEhrApiDetails: AppointmentEhrApiDetails
}

export interface AppointmentEhrApiDetails {
    CustomApi: boolean,
    CustomApiDetails: ApiDetails,
    FhirApi: boolean,
    FhirApiDetails: ApiDetails,
    FollowupMechanism: FollowupMechanism
}

export interface FollowupMechanism {
    ManualTrigger: boolean,
    ScheduleTrigger: boolean,
    ScheduleFrequency: ScheduleFrequency,
    ScheduleTiming: string,
    FollowupMessages: boolean,
    MessageFrequency: MessageFrequency
}

export interface MessageFrequency {
    OneDayBefore: boolean,
    OneHourBefore: boolean,
    OneWeekBefore: boolean,
}

export interface ScheduleFrequency {
    Daily : boolean,
    Weekly : boolean,
    WeekDay: WeekDay,
    Monthly : boolean,
    DayOfMonth: number,
}

export interface ApiDetails {
    Url? : string,
    Credentials?: Credentials,
}

export interface Credentials {
    UserName?: string,
    Password?: string,
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
    UserInterfaces       : UserInterfaces,
    Common               : CommonSettings,
    PatientApp           : PatientAppSettings,
    ChatBot              : ChatBotSettings,
    Forms                : FormsSettings
}

export interface TenantSettingsDto extends TenantSettingsDomainModel {
    TenantId ?: string;
}
