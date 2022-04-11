import { google, healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export interface GcpFhirConfiguration {
    ProjectId: string;
    CloudRegion: string;
    DatasetId: string;
    FhirStoreId: string;
    DicomStoreId: string;
    FhirVersion: string;
}

export class GcpHelper {

    public static getGcpClient = async (): Promise<healthcare_v1.Healthcare> => {
        const healthcare = google.healthcare({
            version : 'v1',
            headers : { 'Content-Type': 'application/fhir+json' }
        });
        const auth = await google.auth.getClient({
            scopes : ['https://www.googleapis.com/auth/cloud-platform'],
        });
        google.options({ auth });
        return healthcare;
    };

    public static getGcpFhirConfig(): GcpFhirConfiguration  {

        const c: GcpFhirConfiguration = {
            ProjectId    : process.env.FHIR_PROJECT_ID,
            CloudRegion  : process.env.FHIR_CLOUD_REGION,
            DatasetId    : process.env.FHIR_DATASET_ID,
            FhirStoreId  : process.env.FHIR_STORE_NAME,
            DicomStoreId : process.env.DICOM_STORE_NAME,
            FhirVersion  : process.env.FHIR_CURRENT_VERSION,
        };
        
        return c;
    }

}
