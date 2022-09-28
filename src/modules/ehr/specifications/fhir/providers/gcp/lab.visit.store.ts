import { healthcare_v1 } from 'googleapis';
import { ILabVisitStore } from '../../../../interfaces/lab.visit.store.interface';
import { GcpHelper } from './helper.gcp';
import { LabVisitDomainModel } from '../../../../../../domain.types/clinical/lab.visit/lab.visit.domain.model';

////////////////////////////////////////////////////////////////////////////////

export class GcpLabVisitStore implements ILabVisitStore {

    create = async (model: LabVisitDomainModel): Promise<any> => {
        var body = this.createLabVisitFhirResource(model);
        const resourceType = 'Encounter';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Encounter';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    update = async (resourceId:string, updates: LabVisitDomainModel): Promise<any> => {
        const resourceType = 'Encounter';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateLabVisitFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Encounter';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createLabVisitFhirResource(model: LabVisitDomainModel): any {

        var resource = {
            resourceType : "Encounter",
            identifier   : [{
                "use"   : "temp",
                "value" : "Encounter_Role_20130404"
            }],
            status : model.CurrentState,
            class  : {
                system  : "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                code    : "IMP",
                display : "inpatient encounter"
            }
        };

        if (model.EhrId != null) {
            resource['subject'] = {
                reference : `Patient/${model.EhrId}`
            };
        }

        if (model.SuggestedLabId != null) {
            resource['serviceProvider'] = {
                reference : "https://www.aiims.edu/en.html",
                type      : "Organization",
                id        : model.SuggestedLabId
            };
        }

        if (model.CreatedBy != null) {
            resource['participant'] = [
                {
                    individual : {
                        reference : "https://www.aiims.edu/images/pdf/CV.pdf",
                        type      : "Practitioner",
                        id        : model.CreatedBy
                    }
                }
            ];
        }

        if (model.DisplayId != null) {
            resource['identifier'] = [
                {
                    use   : "temp",
                    value : model.DisplayId
                }
            ];
        }

        return resource;
    }

    private updateLabVisitFhirResource(updates: LabVisitDomainModel, existingResource: any): any {

        existingResource.resourceType = "Encounter";

        if (updates.EhrId != null) {
            existingResource['subject'] = {
                reference : `Patient/${updates.EhrId}`
            };
        }

        if (updates.CurrentState != null) {
            existingResource['status'] = updates.CurrentState;
        }

        if (updates.SuggestedLabId != null) {
            existingResource['serviceProvider'] = {
                reference : "https://www.aiims.edu/en.html",
                type      : "Organization",
                id        : updates.SuggestedLabId
            };
        }

        if (updates.CreatedBy != null) {
            existingResource['participant'] = [
                {
                    individual : {
                        reference : "https://www.aiims.edu/images/pdf/CV.pdf",
                        type      : "Practitioner",
                        id        : updates.CreatedBy
                    }
                }
            ];
        }

        if (updates.DisplayId != null) {
            existingResource['identifier'] = [
                {
                    use   : "temp",
                    value : updates.DisplayId
                }
            ];
        }

        return existingResource;
    }

}
