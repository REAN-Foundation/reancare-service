import 'reflect-metadata';
import { IDiagnosticConditionStore } from '../../../../interfaces/diagnostic.condition.store.interface';
import { injectable } from "tsyringe";
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Helper } from '../../../../../../common/helper';
import { DiagnosticConditionDomainModel } from '../../../../../../domain.types/clinical/diagnosis/diagnostic.condition.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class GcpDiagnosticConditionStore implements IDiagnosticConditionStore {

    add = async (model: DiagnosticConditionDomainModel): Promise<any> => {
        var body = this.createDiagnosticConditionFhirResource(model);
        const resourceType = 'Condition';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Condition';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    update = async (resourceId:string, updates: DiagnosticConditionDomainModel): Promise<any> => {
        const resourceType = 'Condition';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateDiagnosticConditionFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Condition';
        await GcpHelper.deleteResource(resourceId, resourceType);
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
