import { Helper } from '../../../../../../common/helper';
import { BloodPressureDomainModel } from '../../../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { IBloodPressureStore } from '../../../../interfaces/blood.pressure.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';

////////////////////////////////////////////////////////////////////////////////

export class GcpBloodPressureStore implements IBloodPressureStore {

    add = async (model: BloodPressureDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createBloodPressureFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Observation', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;

            return data.id;
        } catch (error) {
            Logger.instance().log(`Error message:: ${JSON.stringify(error.message)}`);
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

    update = async (resourceId:string, updates: BloodPressureDomainModel): Promise<any> => {

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
        const body: healthcare_v1.Schema$HttpBody = this.updateBloodPressureFhirResource(updates, data);
        const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
            name        : parent,
            requestBody : body,
        });
        var data: any = updatedResource.data;
        Logger.instance().log(`Updated ${resourceType} resource:\n${updatedResource.data}`);
        return data;
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
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    //#region Private methods

    private createBloodPressureFhirResource(model: BloodPressureDomainModel): any {

        var resource = {
            resourceType : "Observation",
            id           : "blood-pressure",
            status       : "final",
            code         : {
                coding : [
                    {
                        system  : "http://loinc.org",
                        code    : "85354-9",
                        display : "Blood pressure panel with all children optional"
                    }
                ],
                text : "Blood pressure systolic & diastolic"
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
                    reference : "https://www.aiims.edu/images/pdf/CV.pdf",
                    type      : "Practitioner",
                    id        : model.RecordedByUserId
                }
            ];
        }

        if (model.Systolic != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "8480-6",
                            "display" : "Systolic blood pressure"
                        },
                        {
                            "system"  : "http://snomed.info/sct",
                            "code"    : "271649006",
                            "display" : "Systolic blood pressure"
                        },
                        {
                            "system"  : "http://acme.org/devices/clinical-codes",
                            "code"    : "bp-s",
                            "display" : "Systolic Blood pressure"
                        }
                    ]
                },
                valueQuantity : {
                    value  : model.Systolic,
                    system : "http://unitsofmeasure.org",
                    unit   : "mmHg",
                    code   : "mm[Hg]"
                }
            });
        }

        if (model.Diastolic != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "8462-4",
                            "display" : "Diastolic blood pressure"
                        }
                    ]
                },
                valueQuantity : {
                    value  : model.Diastolic,
                    unit   : "mmHg",
                    system : "http://unitsofmeasure.org",
                    code   : "mm[Hg]"
                }
            });
        }
        
        return resource;
    }
    
    private updateBloodPressureFhirResource(updates: BloodPressureDomainModel, existingResource: any): any {

        existingResource.resourceType = "Observation";

        /*if (updates.VisitEhirId != null) {
            existingResource['VisitId'] = updates.VisitEhrId
        }*/

        if (updates.RecordDate != null) {
            existingResource['effectiveDateTime'] = Helper.formatDate(updates.RecordDate);
        }
        if (updates.RecordedByUserId != null) {
            existingResource['performer'] = [
                {
                    reference : "https://www.aiims.edu/images/pdf/CV.pdf",
                    type      : "Practitioner",
                    id        : updates.RecordedByUserId                }
            ];
        }

        if (updates.Systolic != null) {
            existingResource.component[0].valueQuantity.value = updates.Systolic;
        }

        if (updates.Diastolic != null) {
            existingResource.component[1].valueQuantity.value = updates.Diastolic;
        }
        
        return existingResource;
    }

}
