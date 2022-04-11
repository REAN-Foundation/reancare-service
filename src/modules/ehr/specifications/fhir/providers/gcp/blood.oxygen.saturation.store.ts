import { Helper } from '../../../../../../common/helper';
import { Logger } from '../../../../../../common/logger';
import { BloodOxygenSaturationDomainModel } from '../../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { IBloodOxygenSaturationStore } from '../../../../interfaces/blood.oxygen.saturation.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { BloodOxygenSaturationSearchFilters } from '../../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types';

////////////////////////////////////////////////////////////////////////////////

export class GcpBloodOxygenSaturationStore implements IBloodOxygenSaturationStore {

    search(filter: BloodOxygenSaturationSearchFilters): Promise<any> {
        throw new Error(`Method not implemented ${filter}`);
    }

    add = async (model: BloodOxygenSaturationDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createBloodOxygenSaturationFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Observation', requestBody: body };
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
            if (error.Message != null) {
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

    update = async (resourceId:string, updates: BloodOxygenSaturationDomainModel): Promise<any> => {

        var g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();
        const resourceType = 'Observation';

        //Get the existing resource
        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
        var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
            { name: parent }
        );
        var data:any = existingResource.data;

        //Construct updated body
        const body: healthcare_v1.Schema$HttpBody = this.updateBloodOxygenSaturationFhirResource(updates, data);
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

    private createBloodOxygenSaturationFhirResource(model: BloodOxygenSaturationDomainModel): any {

        var resource = {
            resourceType : "Observation",
            id           : "sat02",
            status       : "final",
            code         : {
                coding : [
                    {
                        "system"  : "http://terminology.hl7.org/CodeSystem/observation-category",
                        "code"    : "vital-signs",
                        "display" : "Vital Signs"
                    }
                ],
                "text" : "Vital Signs"
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

        if (model.BloodOxygenSaturation != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "2708-6",
                            "display" : "Oxygen saturation in Arterial blood"
                        },
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "59408-5",
                            "display" : "Oxygen saturation in Arterial blood by Pulse oximetry"
                        },
                        {
                            "system"  : "urn:iso:std:iso:11073:10101",
                            "code"    : "150456",
                            "display" : "MDC_PULS_OXIM_SAT_O2"
                        }
                    ]
                },
                valueQuantity : {
                    "value"  : model.BloodOxygenSaturation,
                    "unit"   : "%",
                    "system" : "http://unitsofmeasure.org",
                    "code"   : "%"
                }
            });
        }
        
        return resource;
    }
    
    // eslint-disable-next-line max-len
    private updateBloodOxygenSaturationFhirResource(updates: BloodOxygenSaturationDomainModel, existingResource: any): any {

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

        if (updates.BloodOxygenSaturation != null) {
            existingResource.component[0].valueQuantity.value = updates.BloodOxygenSaturation;
        }
        
        return existingResource;
    }

}
