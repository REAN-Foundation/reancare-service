import 'reflect-metadata';
import { DiagnosticConditionDomainModel,DiagnosticConditionSearchFilters
} from "../../../../../../domain.types/diagnostic.condition/diagnostic.condition.domain.model";
import { IDiagnosticConditionStore } from '../../../../interfaces/diagnostic.condition.store.interface';
import { injectable } from "tsyringe";
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Helper } from '../../../../../../common/helper';
import { Logger } from '../../../../../../common/logger';

///////////////////////////////////////////////////////////////////

@injectable()
export class GcpDiagnosticConditionStore implements IDiagnosticConditionStore {

    search(filter: DiagnosticConditionSearchFilters): Promise<any> {
        throw new Error('Method not implemented.');
    }

    add = async (model: DiagnosticConditionDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createDiagnosticConditionFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Condition', requestBody: body };
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
            const resourceType = 'Condition';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            
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

    update = async (resourceId:string, updates: DiagnosticConditionDomainModel): Promise<any> => {
        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Condition';

            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data:any = existingResource.data;

            const body: healthcare_v1.Schema$HttpBody = this.updateDiagnosticConditionFhirResource(updates, data);
            const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
                name        : parent,
                requestBody : body,
            });
            var data: any = updatedResource.data;
            Logger.instance().log(`Updated ${resourceType} resource: ${updatedResource.data}`);

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
            const resourceType = 'Condition';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            await g.projects.locations.datasets.fhirStores.fhir.delete(
                { name: parent }
            );
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    //#region Private methods

    private createDiagnosticConditionFhirResource(model: DiagnosticConditionDomainModel): any {

        var resource = {
            resourceType   : "Condition",
            id             : "diagnostic-condition",
            clinicalStatus : {
                coding : [
                    {
                        system : "http://terminology.hl7.org/CodeSystem/condition-clinical",
                        code   : model.ClinicalStatus,
                    }
                ]
            },
            code : {
                coding : [],
            },

            bodySite : [{
                coding : [
                    {
                        system  : "http://snomed.info/sct",
                        code    : "49521004",
                        display : model.MedicalCondition.BodySite
                    }
                ],
                text : model.MedicalCondition.BodySite

            }],
        };

        if (model.EhrId != null) {
            resource['subject'] = {
                reference : `Patient/${model.EhrId}`
            };
        }

        if (model.OnsetDate != null) {
            resource['onsetDateTime'] = Helper.formatDate(model.OnsetDate);
        }

        if (model.MedicalCondition.Description != null) {
            resource.code.coding.push({
   
                system  : "http://snomed.info/sct",
                code    : "39065001",
                display : model.MedicalCondition.Description
            });
        }
        return resource;
    }
    
    private updateDiagnosticConditionFhirResource(updates: DiagnosticConditionDomainModel, existingResource: any): any {
        
        existingResource["clinicalStatus"] =  {
            coding : [
                {
                    system : "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    code   : updates.ClinicalStatus,
                }
            ]
        };

        existingResource["bodySite"] = [{
            coding : [
                {
                    system  : "http://snomed.info/sct",
                    code    : "49521004",
                    display : updates.MedicalCondition.BodySite
                }
            ],
            text : updates.MedicalCondition.BodySite

        }];

        if (updates.EhrId != null) {
            existingResource['subject'] = {
                reference : `Patient/${updates.EhrId}`
            };
        }

        if (updates.OnsetDate != null) {
            existingResource['onsetDateTime'] = Helper.formatDate(updates.OnsetDate);
        }

        if (updates.MedicalCondition.Description != null) {

            existingResource["code"] = {
                coding : []
            };
            
            existingResource.code.coding.push({
   
                system  : "http://snomed.info/sct",
                code    : "39065001",
                display : updates.MedicalCondition.Description
            });
        }

        return existingResource;

    }

}
