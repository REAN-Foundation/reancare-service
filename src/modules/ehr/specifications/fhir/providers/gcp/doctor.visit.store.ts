import { Helper } from '../../../../../../common/helper';
import { DoctorVisitDomainModel } from '../../../../../../domain.types/doctor.visit/doctor.visit.domain.model';
import { IDoctorVisitStore } from '../../../../../ehr/interfaces/doctor.visit.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';

////////////////////////////////////////////////////////////////////////////////

export class GcpDoctorVisitStore implements IDoctorVisitStore {

    create = async (model: DoctorVisitDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createDoctorVisitFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Encounter', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;
            var resourceStr = JSON.stringify(data, null, 2);
            Logger.instance().log(`Created FHIR resource ${resourceStr}`);
            return data.id;
        } catch (error) {
            Logger.instance().log(`Error:: ${JSON.stringify(error)}`);
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
            //console.log(`Created FHIR resource ${resourceStr}`);
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

    update = async (resourceId: string, updates: DoctorVisitDomainModel): Promise<any> => {
        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Encounter';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = existingResource.data;

            //Construct updated body
            const body: healthcare_v1.Schema$HttpBody = this.updateDoctorVisitFhirResource(updates, data);
            const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
                name        : parent,
                requestBody : body,
            });
            var data: any = updatedResource.data;
            Logger.instance().log(`Updated ${resourceType} resource:\n ${updatedResource.data}`);
            return data;

        }  catch (error) {
            Logger.instance().log(`Error:: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }

    };

    delete = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Encounter';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            await g.projects.locations.datasets.fhirStores.fhir.delete(
                { name: parent }
            );
        }
        catch (error) {
            Logger.instance().log(`Error:: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    };

    //#region Private methods

    private createDoctorVisitFhirResource(model: DoctorVisitDomainModel): any {

        var resource = {
            resourceType : "Encounter",
            id           : "f201",
            status       : "finished",
            class        : {
                system  : "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                code    : "AMB",
                display : "ambulatory"
            },
            period : {
                start : "2022-03-28",
                end   : "2022-03-30"
            },
            participant : [
                {
                    "individual" : {
                        "reference" : "Practitioner/f201"
                    }
                }
            ],
        };

        if (model.EhrId != null) {
            resource['subject'] = {
                reference : `Patient/${model.EhrId}`
            };
        }

        /*if (model.PastVisitEhirId != null) {
            resource[''] = model.PastVisitEhrId
        }*/

        if (model.StartDate != null) {
            resource.period.start = Helper.formatDate(model.StartDate);
        }

        if (model.EndDate != null) {
            resource.period.end = Helper.formatDate(model.EndDate);
        }

        if (model.DoctorEhrId != null) {
            resource.participant.push({
                individual : {
                    reference : `Practitioner/${model.DoctorEhrId}`
                }
            });
        }

        return resource;
    }

    private updateDoctorVisitFhirResource(updates: DoctorVisitDomainModel, existingResource: any): any {

        existingResource.resourceType = "Encounter";

        if (updates.EhrId != null) {
            existingResource['subject'] = {
                reference : `Patient/${updates.EhrId}`
            };
        }

        if (updates.StartDate != null) {
            existingResource['period.start'] = Helper.formatDate(updates.StartDate);
        }

        if (updates.EndDate != null) {
            existingResource['period.end'] = Helper.formatDate(updates.EndDate);
        }
 
        return existingResource;
    }

}
