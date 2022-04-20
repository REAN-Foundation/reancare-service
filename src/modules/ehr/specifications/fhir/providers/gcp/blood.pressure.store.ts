import { Helper } from '../../../../../../common/helper';
import { BloodPressureDomainModel } from '../../../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { IBloodPressureStore } from '../../../../interfaces/blood.pressure.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpBloodPressureStore implements IBloodPressureStore {

    add = async (model: BloodPressureDomainModel): Promise<any> => {
        var body = this.createBloodPressureFhirResource(model);
        const resourceType = 'Observation';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };
    
    update = async (resourceId:string, updates: BloodPressureDomainModel): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateBloodPressureFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        await GcpHelper.deleteResource(resourceId, resourceType);
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
