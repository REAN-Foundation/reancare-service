import { Helper } from '../../../../../../common/helper';
import { PulseDomainModel } from '../../../../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';
import { IPulseStore } from '../../../../interfaces/pulse.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpPulseStore implements IPulseStore {

    add = async (model: PulseDomainModel): Promise<any> => {
        var body = this.createPulseFhirResource(model);
        const resourceType = 'Observation';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };
    
    update = async (resourceId:string, updates: PulseDomainModel): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updatePulseFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createPulseFhirResource(model: PulseDomainModel): any {

        var resource = {
            resourceType : "Observation",
            id           : "pulse",
            status       : "final",
            code         : {
                coding : [
                    {
                        "system"  : "http://terminology.hl7.org/CodeSystem/observation-category",
                        "code"    : "vital-signs",
                        "display" : "Vital Signs"
                    }
                ],
                text : "Vital Signs"
            },
            component : [],
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

        if (model.Pulse != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "15074-8",
                            "display" : "Beats per min of heart"
                        },
                     
                    ]
                },
                valueQuantity : {
                    value  : model.Pulse,
                    system : "http://unitsofmeasure.org",
                    unit   : "bpm",
                    code   : "beatsPerMin"
                }
            });
        }

        return resource;
    }
    
    private updatePulseFhirResource(updates: PulseDomainModel, existingResource: any): any {

        existingResource.resourceType = "Observation";

        /*if (updates.VisitEhirId != null) {
            existingResource['VisitId'] = updates.VisitEhrId
        }*/

        if (updates.Pulse != null) {
            existingResource.component[0].valueQuantity.value = updates.Pulse;
        }

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

        return existingResource;
    }

}
