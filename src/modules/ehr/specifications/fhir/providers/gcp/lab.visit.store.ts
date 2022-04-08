import { healthcare_v1 } from 'googleapis';
import { ILabVisitStore } from '../../../../interfaces/lab.visit.store.interface';
import { Logger } from '../../../../../../common/logger';
import { GcpHelper } from './helper.gcp';
import { LabVisitDomainModel } from '../../../../../../domain.types/lab.visit/lab.visit.domain.model';

////////////////////////////////////////////////////////////////////////////////

export class GcpLabVisitStore implements ILabVisitStore {

    create = async (model: LabVisitDomainModel): Promise<any> => {
        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();

            var body = this.createLabVisitFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Encounter', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;

            //var resourceStr = JSON.stringify(data, null, 2);
            //Logger.instance().log(`Created FHIR resource ${resourceStr}`);

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

            const resourceType = 'Encounter';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;

            //var resourceStr = JSON.stringify(data, null, 2);
            //Logger.instance().log(`Created FHIR resource ${resourceStr}`);

            return data;

        } catch (error) {

            if (error.message !== null) {
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

    update = async (resourceId:string, updates: LabVisitDomainModel): Promise<any> => {

        var g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        const resourceType = 'Encounter';

        //Get the existing resource
        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
        var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
            { name: parent }
        );
        var data:any = existingResource.data;

        //delete data.id; //Remove id from the resource
        
        //Construct updated body
        const body: healthcare_v1.Schema$HttpBody = this.updateLabVisitFhirResource(updates, data);
        const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
            name        : parent,
            requestBody : body,
        });
        
        var data: any = updatedResource.data;
        Logger.instance().log(`Updated ${resourceType} resource:\n${updatedResource.data}`);

        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        var g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();
        const resourceType = 'Encounter';

        //Get the existing resource
        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
        await g.projects.locations.datasets.fhirStores.fhir.delete(
            { name: parent }
        );
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
