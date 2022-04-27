import { Helper } from '../../../../../../common/helper';
import { BodyHeightDomainModel } from '../../../../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { IBiometricsHeightStore } from '../../../../interfaces/biometrics.height.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpBiometricsHeightStore implements IBiometricsHeightStore {

    add = async (model: BodyHeightDomainModel): Promise<any> => {
        var body = this.createBiometricsHeightFhirResource(model);
        const resourceType = 'Observation';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };
    
    update = async (resourceId:string, updates: BodyHeightDomainModel): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateBiometricsHeightFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        await GcpHelper.deleteResource(resourceId, resourceType);
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

        if (updates.RecordDate != null) {
            var str = Helper.formatDate(updates.RecordDate);
            existingResource.effectiveDateTime = str;
        }

        if (updates.RecordedByUserId != null) {
            existingResource['performer'] = [
                {
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
