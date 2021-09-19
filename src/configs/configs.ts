
export type DatabaseType = 'SQL' | 'NoSQL';
export type DatabaseORM = 'Sequelize' | 'Knex' | 'Mongoose';
export type DatabaseFlavour = 'MySQL' | 'PostGreSQL' | 'MongoDB';
export type EHRSpecification = 'FHIR'| 'OpenEHR' | 'Mock';
export type FHIRProvider = 'GCP-FHIR' | 'Azure-FHIR' | 'AWS-HealthLake' | 'Hapi-FHIR';
export type OpenEHRProvider = 'OpenEHRBase';
export type FileStorageProvider = 'AWS-S3' | 'GCP-FileStore' | 'Custom';
export type SMSServiceProvider = 'Twilio';
export type EmailServiceProvider = 'SendGrid';
export type InAppNotificationServiceProvider = 'Firebase';
export type EHRProvider = FHIRProvider | OpenEHRProvider;
export type AuthorizationType = 'Custom'; //TBD: Other options need to be supported
export type AuthenticationType = 'Custom'; //TBD: Other options need to be supported

///////////////////////////////////////////////////////////////////////////////////////////

export interface AuthConfig {
    Authentication: AuthenticationType;
    Authorization: AuthorizationType;
}

export interface DatabaseConfig {
    Type: DatabaseType;
    ORM: DatabaseORM;
    Flavour: DatabaseFlavour;
}

export interface EHRConfig {
    Specification: EHRSpecification;
    Provider: EHRProvider;
}

export interface FileStorageConfig {
    Provider: FileStorageProvider;
}

export interface CommunicationConfig {
    SMSProvider: SMSServiceProvider,
    EmailProvider: EmailServiceProvider,
    InAppNotificationProvider: InAppNotificationServiceProvider
}

export interface Configurations {
    Auth: AuthConfig;
    Database: DatabaseConfig;
    Ehr: EHRConfig;
    FileStorage: FileStorageConfig;
    Communication: CommunicationConfig;
    MaxUploadFileSize: number;
}
