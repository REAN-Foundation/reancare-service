
export type DatabaseType = 'SQL' | 'NoSQL';
export type DatabaseORM = 'Sequelize' | 'TypeORM' | 'Mongoose';
export type EHRSpecification = 'FHIR'| 'OpenEHR' | 'Mock';
export type FHIRProvider = 'GCP-FHIR' | 'Azure-FHIR' | 'AWS-HealthLake' | 'Hapi-FHIR';
export type OpenEHRProvider = 'OpenEHRBase';
export type FileStorageProvider = 'AWS-S3' | 'GCP-FileStore' | 'Custom';
export type FeatureFlagsProvider = 'Firebase-Remote-Config' | 'Custom';
export type SMSServiceProvider = 'Twilio' | 'Mock';
export type EmailServiceProvider = 'SendGrid' | 'Mock';
export type InAppNotificationServiceProvider = 'Firebase' | 'Mock';
export type EHRProvider = FHIRProvider | OpenEHRProvider;
export type AuthorizationType = 'Custom'; //TBD: Other options need to be supported
export type AuthenticationType = 'Custom'; //TBD: Other options need to be supported

///////////////////////////////////////////////////////////////////////////////////////////

export interface AuthConfig {
    Authentication: AuthenticationType;
    Authorization : AuthorizationType;
    UseRefreshToken: boolean;
    AccessTokenExpiresInSeconds: number;
    RefreshTokenExpiresInSeconds: number;
}

export interface DatabaseConfig {
    Type   : DatabaseType;
    ORM    : DatabaseORM;
}

export interface EHRConfig {
    Enabled      : boolean;
    Specification: EHRSpecification;
    Provider     : EHRProvider;
}

export interface FileStorageConfig {
    Provider: FileStorageProvider;
}

export interface FeatureFlagsConfig {
    Provider: FeatureFlagsProvider;
}

export interface CommunicationConfig {
    SMSProvider              : SMSServiceProvider,
    EmailProvider            : EmailServiceProvider,
    InAppNotificationProvider: InAppNotificationServiceProvider
}

export interface TemporaryFoldersConfig {
    Upload                    : string,
    Download                  : string,
    CleanupFolderBeforeMinutes: number
}

export interface CareplanConfig {
    Provider            : string;
    Name                : string;
    Code                : string;
    DisplayName         : string;
    DefaultDurationDays?: number;
    Description         : string;
}

export interface FormServiceProvider {
    Provider: string;
    Code    : string;
}

export interface WebhookControllerProvider {
    Provider: string;
    Code    : string;
}

export interface Configurations {
    SystemIdentifier    : string;
    BaseUrl             : string;
    Auth                : AuthConfig;
    Database            : DatabaseConfig;
    Ehr                 : EHRConfig;
    FileStorage         : FileStorageConfig;
    FeatureFlags        : FeatureFlagsConfig;
    Communication       : CommunicationConfig;
    TemporaryFolders    : TemporaryFoldersConfig;
    Careplans           : {
        Enabled : boolean;
        Provider: string;
        Service : string;
        Plans   : CareplanConfig[]
    } [];
    MaxUploadFileSize   : number;
    FormServiceProviders: FormServiceProvider[];
    WebhookControllerProviders: WebhookControllerProvider[];
    Gamification        : boolean;
    EHRAnalytics        : boolean;
}
