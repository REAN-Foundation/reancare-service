import { FamilyHistoryDomainModel } from '../../../../../../domain.types/family.history/family.history.domain.model';
import { IFamilyHistoryStore } from '../../../../../ehr/interfaces/family.history.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';
import { Helper } from '../../../../../../common/helper';

////////////////////////////////////////////////////////////////////////////////

export class GcpFamilyHistoryStore implements IFamilyHistoryStore {

    create = async (model: FamilyHistoryDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createFamilyHistoryFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'FamilyMemberHistory', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;
            var resourceStr = JSON.stringify(data, null, 2);
            Logger.instance().log(`Created FHIR resource ${resourceStr}`);
            return data.id;
        } catch (error) {
            Logger.instance().log(`Error:: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    };

    getById = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'FamilyMemberHistory';
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

    update = async (resourceId: string, updates: FamilyHistoryDomainModel): Promise<any> => {

        var g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();
        const resourceType = 'FamilyMemberHistory';

        //Get the existing resource
        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
        var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
            { name: parent }
        );
        var data: any = existingResource.data;

        //Construct updated body
        const body: healthcare_v1.Schema$HttpBody = this.updateFamilyHistoryFhirResource(updates, data);
        const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
            name        : parent,
            requestBody : body,
        });
        var data: any = updatedResource.data;
        Logger.instance().log(`Updated ${resourceType} resource:\n ${updatedResource.data}`);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'FamilyMemberHistory';

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

    private createFamilyHistoryFhirResource(model: FamilyHistoryDomainModel): any {

        var resource = {
            resourceType : "FamilyMemberHistory",
            id           : "fmh-1",
            status       : "completed",
            // patient: {
            //     reference: "Patient/f201",
            //     display: "Roel"
            // },
            // relationship: {
            //     coding: [
            //         {
            //             system: "http://snomed.info/sct",
            //             code: "72705000",
            //             display: "Mother"
            //         }
            //     ]
            // },
            // deceasedBoolean: false,
            // condition: [
            //     {
            //         code: {
            //             coding: [
            //                 {
            //                     system: "http://snomed.info/sct",
            //                     code: "39839004",
            //                     display: "Diaphragmatic hernia"
            //                 }
            //             ]
            //         }
            //     }
            // ]
        };

        if (model.EhrId != null) {
            resource["patient"] = {
                reference : `Patient/${model.EhrId}`,
            };

        }

        if (model.Relationship != null) {
            resource['relationship'] = {
                coding : [
                    {
                        system  : "http://snomed.info/sct",
                        code    : "72705000",
                        display : model.Relationship
                    }
                ]
            };
        }

        if (model.Status != null) {
            resource["status"] = model.Status;
        }

        if (model.Condition != null) {
            resource["condition"] = [
                {
                    code : {
                        coding : [
                            {
                                system  : "http://snomed.info/sct",
                                code    : model.ConditionId,
                                display : model.Condition
                            }
                        ]
                    }
                }
            ];
        }

        if (model.Date != null) {
            resource["date"] = Helper.formatDate(model.Date);
        }

        return resource;
    }

    private updateFamilyHistoryFhirResource(updates: FamilyHistoryDomainModel, existingResource: any): any {

        existingResource.resourceType = "FamilyMemberHistory";

        if (updates.Relationship != null) {
            existingResource['relationship'] = {
                coding : [
                    {
                        system  : "http://snomed.info/sct",
                        code    : "72705000",
                        display : updates.Relationship
                    }
                ]
            };
        }

        if (updates.Status != null) {
            existingResource["status"] = updates.Status;
        }

        if (updates.Condition != null) {
            existingResource["condition"] = [
                {
                    code : {
                        coding : [
                            {
                                system  : "http://snomed.info/sct",
                                code    : updates.ConditionId,
                                display : updates.Condition
                            }
                        ]
                    }
                }
            ];
        }

        if (updates.Date != null) {
            existingResource["date"] = Helper.formatDate(updates.Date);
        }

        return existingResource;
    }

}
