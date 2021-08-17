
export type EHRSpecification = 'FHIR'| 'OpenEHR' | 'Mock';
export type FHIRProvider = 'GCP-FHIR' | 'Azure-FHIR' | 'AWS-HealthLake' | 'Hapi-FHIR';
export type OpenEHRProvider = 'OpenEHRBase';
export type EHRProvider = FHIRProvider | OpenEHRProvider;

export interface EHRConfig {
    Specification: EHRSpecification;
    Provider: EHRProvider;
}

export interface Configurations {
    Ehr: EHRConfig;
    MaxUploadFileSize: number;
}
