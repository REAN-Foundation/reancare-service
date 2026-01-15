import { Setting } from "./setting";
import { VitalsThresholds } from "./vitals.thresholds.types";

export enum TenantSettingsTypes {
    Common              = 'Common',
    Followup            = 'Followup',
    ChatBot             = 'ChatBot',
    Forms               = 'Forms',
    Consent             = 'Consent',
    CustomSettings      = 'CustomSettings',
    VitalsThresholds    = 'VitalsThresholds',
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
    TenantSettingsTypes.Common,
    TenantSettingsTypes.Followup,
    TenantSettingsTypes.ChatBot,
    TenantSettingsTypes.Forms,
    TenantSettingsTypes.Consent,
    TenantSettingsTypes.CustomSettings,
    TenantSettingsTypes.VitalsThresholds,
];

export interface UserInterfaces {
    PatientApp    : boolean,
    ChatBot       : boolean,
    Forms         : boolean,
    PatientPortal : boolean,
    Followup      : boolean,
}

export interface ClinicalFeatures{
    Vitals               : Setting;
    LabRecords           : Setting;
    Symptoms             : Setting;
    SymptomAssessments   : Setting;
    DrugsManagement      : Setting;
    Medications          : Setting;
    Careplans            : Setting;
    Assessments          : Setting;
    DailyAssessments     : Setting;
    Appointments         : Setting;
    Visits               : Setting;
    Orders               : Setting;
    Documents            : Setting;
    PatientHealthReports : Setting;

}

export interface Wellness{
    Exercise      : Setting;
    Nutrition     : Setting;
    Meditation    : Setting;
    Priorities    : Setting;
    Goals         : Setting;
    DeviceIntegration: Setting;
}

export interface EHR {
    FHIRStorage    : Setting;
    EHRIntegration : Setting;
    ABDM           : Setting;
}

export interface Community{
    UserGroups : Setting;
    Chat       : Setting;
}

export interface Research{
    Cohorts  : Setting;
}

export interface Affiliations{
    HealthCenters  : Setting;
    HealthSystems  : Setting;
}

export interface Miscellaneous{
    Gamification  : Setting;
    Notifications : Setting;
    Newsfeeds     : Setting;
    Notices       : Setting;
}

export interface Educational{
    Courses          : Setting;
    LearningJourney  : Setting;
    KnowledgeNuggets : Setting;
}

export interface General{
    ViewPersonRoles : Setting;
    ViewUsers       : Setting;
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
    CustomQueries: Setting;
    Quicksight   : Setting;
}

export interface CommonSettings {
    UserInterfaces  : UserInterfaces;
    Clinical        : ClinicalFeatures;
    Wellness        : Wellness;
    EHR             : EHR;
    Community       : Community;
    Research        : Research;
    Affiliations    : Affiliations;
    Miscellaneous   : Miscellaneous;
    Educational     : Educational;
    Analysis        : AnalysisSettings;
    General         : General;
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
    Name                : string;
    OrganizationName?    : string;
    OrganizationLogo?    : string;
    OrganizationWebsite? : string;
    Favicon?             : string;
    Description?         : string;
    DefaultLanguage?     : string;
    SchemaName?          : string;
    MessageChannels     : MessageChannels;
    SupportChannels     : SupportChannels;
    Personalization     : boolean,
    LocationContext     : boolean,
    Localization        : boolean,
    RemindersMedication : boolean,
    QnA                 : boolean,
    Consent             : boolean,
    WelcomeMessage      : boolean,
    WelcomeMessages?    : WelcomeMessage[],
    Feedback            : boolean,
    ReminderAppointment : boolean,
    AppointmentFollowup : boolean,
    ConversationHistory : boolean,
    Emojis              : boolean,
    BasicAssessment     : boolean,
    BasicCarePlan       : boolean,
    Timezone?           : string
}

export enum FollowupSource {
  File = 'File',
  Api = 'Api',
  None = 'None',
}

export enum ScheduleFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

type ReminderTriggerType =
  | 'PreviousDay'
  | 'SameDayMorning'
  | 'StartOfDay'
  | 'XHoursBefore'
  | 'XMinutesBefore'
  | 'CustomTimeBefore'
  | 'AfterAppointment'
  | 'EndOfDay'
  | 'NoReminder';

export interface ReminderTrigger {
    Type: ReminderTriggerType;
    OffsetValue?: number;
    OffsetUnit?: 'minutes' | 'hours' | 'days';
    TimeOfDay?: string;
}

export interface FileUploadConfig {
    FileColumnFormat: string;
    FileType: 'csv' | 'xlsx' | 'json'| 'xml'| 'txt'| 'pdf';
    ReminderSchedule: ReminderTrigger[];
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ResponseType = 'json' | 'text' | 'form' | 'xml';

interface ApiAuthConfig {
    Method: HttpMethod;
    Url: string;
    Body?: any;
    QueryParams?: Record<string, string>;
    Headers?: Record<string, string>;
    TokenPath: string;
    ResponseType?: ResponseType;
    TokenInjection: {
        Location: 'header' | 'query' | 'body';
        Key: string;
        Prefix?: string;
  };
}

interface ApiFetchConfig {
    Method: HttpMethod;
    Url: string;
    QueryParams?: Record<string, string>;
    Body?: any;
    Headers?: Record<string, string>;
    ResponseType?: ResponseType;
    ResponseField?: string;
}

export interface ApiIntegrationConfig {
    Auth?: ApiAuthConfig;
    Fetch: ApiFetchConfig;
    ReminderSchedule: ReminderTrigger[];
    ScheduleFrequency: ScheduleFrequency;
}

export interface FollowupSettings {
    Source: FollowupSource,
    FileUploadSettings?: FileUploadConfig,
    ApiIntegrationSettings?: ApiIntegrationConfig,
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

export interface ConsentSettings {
    TenantId?    : string;
    TenantName?  : string;
    TenantCode?  : string;
    DefaultLanguage?: string;
    Messages?: ConsentMessage[];
}

export interface ConsentMessage {
    LanguageCode?  : string;
    Content?: string;
    WebsiteURL?  : string;
}

export interface WelcomeMessage {
    LanguageCode?  : string;
    Content?       : string;
    URL?           : string;
}

export enum CustomSettingDataType {
    String  = 'string',
    Number  = 'number',
    Boolean = 'boolean',
    Object  = 'object',
    Array   = 'array'
}

export interface CustomSettingItem {
    Name        : string;
    Description : string;
    DataType    : CustomSettingDataType;
    Value       : string | number | boolean | object | any[];
}

export interface CustomSettings {
    [key: string]: CustomSettingItem;
}

export interface TenantSettingsDomainModel {
    Common?                 : CommonSettings,
    Followup?               : FollowupSettings,
    ChatBot?                : ChatBotSettings,
    Forms?                  : FormsSettings,
    Consent?                : ConsentSettings,
    CustomSettings?         : CustomSettings,
    VitalsThresholds?       : VitalsThresholds,
}

export interface TenantSettingsDto extends TenantSettingsDomainModel {
    TenantId ?: string;
}

// export interface BotSecrets {
//   TelegramBotToken?                 : string;
//   TelegramMediaPathUrl?             : string;
//   WebhookTelegramClientUrlToken?    : string;
//   WebhookWhatsappClientHeaderToken? : string;
//   WebhookWhatsappClientUrlToken?    : string;
//   MetaApiToken?                     : string;
//   WhatsappPhoneNumberId?            : string;
//   SlackTokenFeedback?               : string;
//   WebhookClickupClientUrlToken?     : string;
//   ClickupListId?                    : string;
//   ClickupAuthentication?            : string;
//   ClickupIssuesListId?              : string;
//   ClickupCaseListId?                : string;
//   CustomMlModelUrl?                 : string;
//   DataBaseName?                     : string;
// }

export enum Environment {
  Development = 'development',
  Uat         = 'uat',
  Production  = 'production'
}

export enum TelegramSecrets {
  BotToken = "BotToken",
  MediaPathUrl = "MediaPathUrl",
  WebhookClientUrlToken = "WebhookClientUrlToken",
}

export enum WhatsappSecrets {
  WebhookClientHeaderToken = "WebhookClientHeaderToken",
  WebhookClientUrlToken = "WebhookClientUrlToken",
  PhoneNumberId = "PhoneNumberId",
}

export enum MetaSecrets {
  ApiToken = "ApiToken",
}

export enum SlackSecrets {
  TokenFeedback = "TokenFeedback",
  FeedbackChannelId = "FeedbackChannelId",
  SecretFeedback = "SecretFeedback"
}

export enum ClickupSecrets {
  WebhookClientUrlToken = "WebhookClientUrlToken",
  ListId = "ListId",
  Authentication = "Authentication",
  IssuesListId = "IssuesListId",
  CaseListId = "CaseListId",
}

export enum MlSecrets {
  CustomMlModelUrl = "CustomMlModelUrl",
}

export enum DatabaseSecrets {
  Name = "DataBaseName"
}

export interface BotSecrets {
  telegram?: {
    [TelegramSecrets.BotToken]?: string;
    [TelegramSecrets.MediaPathUrl]?: string;
    [TelegramSecrets.WebhookClientUrlToken]?: string;
  };

  whatsapp?: {
    [WhatsappSecrets.WebhookClientHeaderToken]?: string;
    [WhatsappSecrets.WebhookClientUrlToken]?: string;
    [WhatsappSecrets.PhoneNumberId]?: string;
  };

  meta?: {
    [MetaSecrets.ApiToken]?: string;
  };

  slack?: {
    [SlackSecrets.TokenFeedback]?: string;
    [SlackSecrets.FeedbackChannelId]?: string;
    [SlackSecrets.SecretFeedback]?: string;
  };

  clickup?: {
    [ClickupSecrets.WebhookClientUrlToken]?: string;
    [ClickupSecrets.ListId]?: string;
    [ClickupSecrets.Authentication]?: string;
    [ClickupSecrets.IssuesListId]?: string;
    [ClickupSecrets.CaseListId]?: string;
  };

  ml?: {
    [MlSecrets.CustomMlModelUrl]?: string;
  };

  database?: {
    [DatabaseSecrets.Name]?: string;
  };
}

