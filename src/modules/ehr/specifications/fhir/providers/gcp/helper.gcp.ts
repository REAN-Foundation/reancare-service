import { google, healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';
import * as fs from 'fs';
import { ApiError } from '../../../../../../common/api.error';

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

        if (!fs.existsSync(process.env.GCP_FHIR_CREDENTIALS_PATH)) {
            throw new ApiError(400, 'GCP FHIR credentials file does not exist!');
        }

        const auth = await google.auth.getClient({
            keyFilename : process.env.GCP_FHIR_CREDENTIALS_PATH,
            scopes      : ['https://www.googleapis.com/auth/cloud-platform'],
        });

        // temporary logs for debugging.
        // Logger.instance().log(`Path of GCP credential file:: ${process.env.GCP_FHIR_CREDENTIALS_PATH}`);
        // const fileContent = fs.readFileSync(process.env.GCP_FHIR_CREDENTIALS_PATH).toString();
        // Logger.instance().log(`File content of GCP credential file:: ${JSON.stringify(fileContent)}`);

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

    public static addResource = async (entity: any, resourceType: string): Promise<any> => {

        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: resourceType, requestBody: entity };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;
            return data.id;
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    public static getResourceById = async (resourceId: string, resourceType: string): Promise<any> => {

        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            return data;
        } catch (error) {
            if (error.message != null) {
                // eslint-disable-next-line no-prototype-builtins
                if (error.message.hasOwnProperty('issue')) {
                    var issue = error.message.issue[0];
                    Logger.instance().log(issue.diagnostics);
                    return null;
                }
            }

            Logger.instance().log(error.message);
        }
    };

    public static updateResource = async (resourceId: string, resourceType: string, entity: any): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();

            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
                name        : parent,
                requestBody : entity,
            });
            var data: any = updatedResource.data;
            Logger.instance().log(`Updated ${resourceType} resource:\n, updatedResource.data`);
            return data;
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    public static deleteResource = async (resourceId: string, resourceType: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            await g.projects.locations.datasets.fhirStores.fhir.delete(
                { name: parent }
            );
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

}
