
export type DatabaseType = 'SQL' | 'NoSQL';
export type DatabaseORM = 'Sequelize' | 'Knex' | 'Mongoose';
export type DatabaseFlavour = 'MySQL' | 'PostGreSQL' | 'MongoDB';
export type EHRSpecification = 'FHIR'| 'OpenEHR' | 'Mock';
export type FHIRProvider = 'GCP-FHIR' | 'Azure-FHIR' | 'AWS-HealthLake' | 'Hapi-FHIR';
export type OpenEHRProvider = 'OpenEHRBase';
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

export interface Configurations {
    Auth: AuthConfig;
    Database: DatabaseConfig;
    Ehr: EHRConfig;
    MaxUploadFileSize: number;
}
