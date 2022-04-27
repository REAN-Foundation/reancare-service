import { CareplanActivityDomainModel
} from '../../../../../../domain.types/clinical/careplan/activity/careplan.activity.domain.model';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';
import { ICarePlanStore } from '../../../../interfaces/careplan.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class GcpCarePlanStore implements ICarePlanStore {

    search(filter): Promise<any> {
        throw new Error(`Method not implemented ${filter}.`);
    }

    add = async (model: CareplanActivityDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createCarePlanFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'CarePlan', requestBody: body };
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
            const resourceType = 'CarePlan';
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

    update = async (resourceId:string, updates: CareplanActivityDomainModel): Promise<any> => {

        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'CarePlan';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data:any = existingResource.data;
            //delete data.id; //Remove id from the resource
        
            //Construct updated body
            const body: healthcare_v1.Schema$HttpBody = this.updateCarePlanFhirResource(updates, data);
            const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
                name        : parent,
                requestBody : body,
            });
            var data: any = updatedResource.data;
            Logger.instance().log(`Updated ${resourceType} resource:\n${updatedResource.data}`);
            return data;

        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    delete = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'CarePlan';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            await g.projects.locations.datasets.fhirStores.fhir.delete(
                { name: parent }
            );
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
            
        }
    };

    //#region Private methods

    private createCarePlanFhirResource(model: CareplanActivityDomainModel): any {

        var resource = {
            resourceType : "CarePlan",
            status       : model.Status,
            intent       : "plan",
            goal         : [
                {
                    reference : "#goal"
                }
            ],
            contained : [],
            activity  : []
            
        };

        if (model.Title != null) {
            resource['title'] = model.Title;
        }

        if (model.Language != null) {
            resource['language'] = model.Language;
        }

        if (model.Description != null) {
            resource['description'] = model.Description;
        }

        if (model.Provider != null) {
            resource['author'] = {
                display : model.Provider
            };
        }

        if (model.Category != null) {
            resource['category'] = [
                {
                    text : model.Category
                }
            ];
        }

        if (model.PatientUserId != null) {
            resource['subject'] = {
                id        : model.ParticipantId,
                reference : `Patient/${model.PatientUserId}`
            };
        }

        if (model.ScheduledAt != null) {
            resource['period'] = {
                start : model.ScheduledAt
            };
        }

        if (model.Description != null) {
            
            var goal = {
                resourceType    : "Goal",
                id              : "goal",
                language        : model.Language,
                lifecycleStatus : "active",
                description     : {
                    text : model.Description
                },
                subject : {
                    reference : `Patient/${model.PatientUserId}`,
                    display   : "patient"
                }
            };
            resource.contained.push(goal);
        }

        if (model.Type != null) {
            
            var activity = {
                reference : {
                    id      : model.PlanCode,
                    display : model.PlanName,
                    type    : model.Type
                }
            };
            resource.activity.push(activity);
        }

        return resource;
    }
    
    private updateCarePlanFhirResource(updates: CareplanActivityDomainModel, existingResource: any): any {

        existingResource.resourceType = "CarePlan";

        existingResource.contained = [];

        existingResource.activity = [];

        if (updates.Status != null) {
            existingResource['status'] = updates.Status;
        }

        if (updates.Title != null) {
            existingResource['title'] = updates.Title;
        }

        if (updates.Language != null) {
            existingResource['language'] = updates.Language;
        }

        if (updates.Description != null) {
            existingResource['description'] = updates.Description;
        }

        if (updates.Provider != null) {
            existingResource['author'] = {
                display : updates.Provider
            };
        }

        if (updates.Category != null) {
            existingResource['category'] = [
                {
                    text : updates.Category
                }
            ];
        }

        if (updates.PatientUserId != null) {
            existingResource['subject'] = {
                id        : updates.ParticipantId,
                reference : `Patient/${updates.PatientUserId}`
            };
        }

        if (updates.ScheduledAt != null) {
            existingResource['period'] = {
                start : updates.ScheduledAt
            };
        }

        if (updates.Description != null) {
            
            var goal = {
                resourceType    : "Goal",
                id              : "goal",
                language        : updates.Language,
                lifecycleStatus : "active",
                description     : {
                    text : updates.Description
                },
                subject : {
                    reference : `Patient/${updates.PatientUserId}`,
                    display   : "patient"
                }
            };
            existingResource.contained.push(goal);
        }

        if (updates.Type != null) {
            
            var activity = {
                reference : {
                    id      : updates.PlanCode,
                    display : updates.PlanName,
                    type    : updates.Type
                }
            };
            existingResource.activity.push(activity);
        }
        
        return existingResource;
    }
        
}
