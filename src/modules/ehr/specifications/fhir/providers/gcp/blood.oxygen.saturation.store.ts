import { Helper } from '../../../../../../common/helper';
import { BloodOxygenSaturationDomainModel } from '../../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { IBloodOxygenSaturationStore } from '../../../../interfaces/blood.oxygen.saturation.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpBloodOxygenSaturationStore implements IBloodOxygenSaturationStore {

    add = async (model: BloodOxygenSaturationDomainModel): Promise<any> => {
        var body = this.createBloodOxygenSaturationFhirResource(model);
        const resourceType = 'Observation';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };
    
    update = async (resourceId:string, updates: BloodOxygenSaturationDomainModel): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateBloodOxygenSaturationFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        await GcpHelper.deleteResource(resourceId, resourceType);
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
