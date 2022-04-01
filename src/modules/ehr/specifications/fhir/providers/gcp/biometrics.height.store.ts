import { Helper } from '../../../../../../common/helper';
import { BodyHeightDomainModel } from '../../../../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { IBiometricsHeightStore } from '../../../../interfaces/biometrics.height.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';

////////////////////////////////////////////////////////////////////////////////

export class GcpBiometricsHeightStore implements IBiometricsHeightStore {

    add = async (model: BodyHeightDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createBiometricsHeightFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Observation', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;
            var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);
            return data.id;
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    getById = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Observation';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            //var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);
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
    
    update = async (resourceId:string, updates: BodyHeightDomainModel): Promise<any> => {
        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Observation';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data:any = existingResource.data;
            //delete data.id; //Remove id from the resource
            
            //Construct updated body
            const body: healthcare_v1.Schema$HttpBody = this.updateBiometricsHeightFhirResource(updates, data);
            const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
                name        : parent,
                requestBody : body,
            });
            var data: any = updatedResource.data;
            Logger.instance().log(`Updated ${resourceType} resource:\n, updatedResource.data`);
            return data;
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    delete = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Observation';

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

    //#region Private methods

    private createBiometricsHeightFhirResource(model: BodyHeightDomainModel): any {

        var resource = {
            resourceType : "Observation",
            id           : "biometric-height",
            status       : "final",
            code         : {
                coding : [
                    {
                        system  : "http://loinc.org",
                        code    : "85354-9",
                        display : "patient height in cm"
                    }
                ],
                text : "Patient height"
            },
            component : []
        };

        if (model.EhrId != null) {
            resource['subject'] = {
                reference : `Patient/${model.EhrId}`
            };
        }

        /*if (model.VisitEhirId != null) {
            resource['VisitId'] = model.VisitEhrId
        }*/

        if (model.RecordDate != null) {
            resource['effectiveDateTime'] = Helper.formatDate(model.RecordDate);
        }

        if (model.RecordedByUserId != null) {
            resource['performer'] = [
                {
                    // reference   : `Practitioner/${model.RecordedByUserId}`,
                    reference : "https://www.aiims.edu/images/pdf/CV.pdf",
                    type      : "Practitioner",
                    id        : model.RecordedByUserId
                }
            ];
        }

        if (model.BodyHeight != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "85354-9",
                            "display" : "person height"
                        },
                    ]
                },
                valueQuantity : {
                    value  : model.BodyHeight,
                    system : "http://unitsofmeasure.org",
                    unit   : "cm",
                    code   : "centimeter"
                }
            });
        }
        
        return resource;
    }
    
    private updateBiometricsHeightFhirResource(updates: BodyHeightDomainModel, existingResource: any): any {

        existingResource.resourceType = "Observation";

        if (updates.EhrId != null) {
            existingResource['subject'] = {
                reference : `Patient/${updates.EhrId}`
            };
        }

        if (updates.RecordDate != null) {
            var str = Helper.formatDate(updates.RecordDate);
            existingResource.effectiveDateTime = str;
        }

        if (updates.RecordedByUserId != null) {
            existingResource['performer'] = [
                {
                    // reference   : `Practitioner/${model.RecordedByUserId}`,
                    reference : "https://www.aiims.edu/images/pdf/CV.pdf",
                    type      : "Practitioner",
                    id        : updates.RecordedByUserId
                }
            ];
        }

        if (updates.Unit != null) {
            existingResource.component[0].valueQuantity.unit = updates.Unit;
        }

        if (updates.BodyHeight != null) {
            existingResource.component[0].valueQuantity.value = updates.BodyHeight;
        }

        return existingResource;
    }
        
}
