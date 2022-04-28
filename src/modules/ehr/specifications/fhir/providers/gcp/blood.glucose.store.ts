import { Helper } from '../../../../../../common/helper';
import { BloodGlucoseDomainModel } from '../../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { IBloodGlucoseStore } from '../../../../interfaces/blood.glucose.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpBloodGlucoseStore implements IBloodGlucoseStore {

    add = async (model: BloodGlucoseDomainModel): Promise<any> => {
        var body = this.createBloodSugarFhirResource(model);
        const resourceType = 'Observation';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };
    
    update = async (resourceId:string, updates: BloodGlucoseDomainModel): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateBloodSugarFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createBloodSugarFhirResource(model: BloodGlucoseDomainModel): any {

        var resource = {
            resourceType : "Observation",
            id           : "blood-sugar",
            status       : "final",
            code         : {
                coding : [
                    {
                        system  : "http://loinc.org",
                        code    : "15074-8",
                        display : "Glucose mg/dL in blood during fasting"
                    }
                ],
                text : "Blood sugar"
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

        if (model.BloodGlucose != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "15074-8",
                            "display" : "Glucose mg/dL in Blood during fasting"
                        },
                     
                    ]
                },
                valueQuantity : {
                    value  : model.BloodGlucose,
                    system : "http://unitsofmeasure.org",
                    unit   : "mg/dL",
                    code   : "mg/[dL]"
                }
            });
        }
       
        return resource;
    }

    private updateBloodSugarFhirResource(updates: BloodGlucoseDomainModel, existingResource: any): any {

        existingResource.resourceType = "Observation";
        
        if (updates.RecordDate != null) {
            var str = Helper.formatDate(updates.RecordDate);
            existingResource.effectiveDateTime = str;
        }
        if (updates.RecordedByUserId != null) {
            existingResource['performer'] = [
                {
                    reference : "https://www.aiims.edu/images/pdf/CV.pdf",
                    type      : "Practitioner",
                    id        : updates.RecordedByUserId                }
            ];
        }

        if (updates.Unit != null) {
            existingResource.component[0].valueQuantity.unit = updates.Unit;
        }

        if (updates.BloodGlucose != null) {
            existingResource.component[0].valueQuantity.value = updates.BloodGlucose;
        }
        
        return existingResource;
    }

}
