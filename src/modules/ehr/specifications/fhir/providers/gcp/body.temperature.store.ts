import { Helper } from '../../../../../../common/helper';
import { BodyTemperatureDomainModel } from '../../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { ITemperatureStore } from '../../../../interfaces/body.temperature.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpTemperatureStore implements ITemperatureStore {

    add = async (model: BodyTemperatureDomainModel): Promise<any> => {
        var body = this.createTemperatureFhirResource(model);
        const resourceType = 'Observation';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };
    
    update = async (resourceId:string, updates: BodyTemperatureDomainModel): Promise<any> => {
        const resourceType = 'Observation';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateTemperatureFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Observation';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createTemperatureFhirResource(model: BodyTemperatureDomainModel): any {

        var resource = {
            resourceType : "Observation",
            id           : "temperature",
            status       : "final",
            code         : {
                coding : [
                    {
                        "system"  : "http://acme.lab",
                        "code"    : "BT",
                        "display" : "Body temperature"
                    },
                    {
                        "system"  : "http://loinc.org",
                        "code"    : "8310-5",
                        "display" : "Body temperature"
                    },
                    {
                        "system"  : "http://loinc.org",
                        "code"    : "8331-1",
                        "display" : "Oral temperature"
                    },
                    {
                        "system"  : "http://snomed.info/sct",
                        "code"    : "56342008",
                        "display" : "Temperature taking"
                    }
                ],
                text : "Temperature"
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

        if (model.BodyTemperature != null) {
            resource.component.push({
                "code" : {
                    "coding" : [
                        {
                            "system"  : "http://acme.lab",
                            "code"    : "BT",
                            "display" : "Body temperature"
                        },
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "8310-5",
                            "display" : "Body temperature"
                        },
                        {
                            "system"  : "http://loinc.org",
                            "code"    : "8331-1",
                            "display" : "Oral temperature"
                        },
                        {
                            "system"  : "http://snomed.info/sct",
                            "code"    : "56342008",
                            "display" : "Temperature taking"
                        }
                    ],
                    "text" : "Temperature"
                },
                valueQuantity : {
                    value  : model.BodyTemperature,
                    unit   : model.Unit,
                    system : "http://unitsofmeasure.org",
                    code   : "Farenheit"
                },
            });
        }

        return resource;
    }
    
    private updateTemperatureFhirResource(updates: BodyTemperatureDomainModel, existingResource: any): any {

        existingResource.resourceType = "Observation";

        /*if (updates.VisitEhirId != null) {
            existingResource['VisitId'] = updates.VisitEhrId
        }*/
        
        if (updates.BodyTemperature != null) {
            existingResource.component[0].valueQuantity.value = updates.BodyTemperature;
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
