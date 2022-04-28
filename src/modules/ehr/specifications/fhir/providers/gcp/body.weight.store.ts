import { Helper } from '../../../../../../common/helper';
import { BodyWeightDomainModel } from '../../../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { IBodyWeightStore } from '../../../../interfaces/body.weight.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpBodyWeightStore implements IBodyWeightStore {

    add = async (model: BodyWeightDomainModel): Promise<any> => {
        var body = this.createBiometricsWeightFhirResource(model);
        const resourceType = 'Observation';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };
    
    update = async (resourceId:string, updates: BodyWeightDomainModel): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateBiometricsWeightFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };
    
    //#region Private methods

    private createBiometricsWeightFhirResource(model: BodyWeightDomainModel): any {

        var resource = {
            resourceType : "Observation",
            id           : "biometric-weight",
            status       : "final",
            code         : {
                coding : [
                    {
                        system  : "http://loinc.org",
                        code    : "85354-9",
                        display : "patient weight in Kg"
                    }
                ],
                text : "Patient weight"
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

        if (model.BodyWeight != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "85354-9",
                            "display" : "person weight in Kg"
                        },
                    ]
                },
                valueQuantity : {
                    value  : model.BodyWeight,
                    system : "http://unitsofmeasure.org",
                    unit   : "Kg",
                    code   : "Kilogram"
                }
            });
        }
        
        return resource;
    }
    
    private updateBiometricsWeightFhirResource(updates: BodyWeightDomainModel, existingResource: any): any {

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

        if (updates.BodyWeight != null) {
            existingResource.component[0].valueQuantity.value = updates.BodyWeight;
        }
        
        return existingResource;
    }
        
}
