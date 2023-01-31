import { FamilyHistoryDomainModel } from '../../../../../../domain.types/clinical/family.history/family.history.domain.model';
import { IFamilyHistoryStore } from '../../../../../ehr/interfaces/family.history.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Helper } from '../../../../../../common/helper';

////////////////////////////////////////////////////////////////////////////////

export class GcpFamilyHistoryStore implements IFamilyHistoryStore {

    create = async (model: FamilyHistoryDomainModel): Promise<any> => {
        var body = this.createFamilyHistoryFhirResource(model);
        const resourceType = 'FamilyMemberHistory';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'FamilyMemberHistory';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    update = async (resourceId:string, updates: FamilyHistoryDomainModel): Promise<any> => {
        const resourceType = 'FamilyMemberHistory';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateFamilyHistoryFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'FamilyMemberHistory';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createFamilyHistoryFhirResource(model: FamilyHistoryDomainModel): any {

        var resource = {
            resourceType : "FamilyMemberHistory",
            id           : "fmh-1",
            status       : "completed",
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
