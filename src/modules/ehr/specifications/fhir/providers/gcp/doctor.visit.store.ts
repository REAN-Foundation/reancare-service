import { Helper } from '../../../../../../common/helper';
import { DoctorVisitDomainModel } from '../../../../../../domain.types/clinical/doctor.visit/doctor.visit.domain.model';
import { IDoctorVisitStore } from '../../../../../ehr/interfaces/doctor.visit.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpDoctorVisitStore implements IDoctorVisitStore {

    create = async (model: DoctorVisitDomainModel): Promise<any> => {
        var body = this.createDoctorVisitFhirResource(model);
        const resourceType = 'Encounter';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Encounter';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    update = async (resourceId:string, updates: DoctorVisitDomainModel): Promise<any> => {
        const resourceType = 'Encounter';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateDoctorVisitFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Encounter';
        await GcpHelper.deleteResource(resourceId, resourceType);
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
                start : "2022-04-03",
                end   : "2022-04-04"
            },
            participant : [
                {
                    individual : {
                        reference : `Practitioner/${model.RecordedByUserId}`,

                    }
                }
            ],

            subject : {
                reference : "Patient/f201",
                display   : "Roel"
            },
        };

        if (model.EhrId != null) {
            resource['subject'] = {
                reference : `Patient/${model.EhrId}`,
                display   : "roel"
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

        if (model.RecordedByUserId != null) {
            resource.participant.push({
                individual : {
                    reference : `Practitioner/${model.RecordedByUserId}`,

                }
            });
        }

        return resource;
    }

    private updateDoctorVisitFhirResource(updates: DoctorVisitDomainModel, existingResource: any): any {

        existingResource.resourceType = "Encounter";

        if (updates.StartDate != null) {
            existingResource.period.start = Helper.formatDate(updates.StartDate);
        }

        if (updates.EndDate != null) {
            existingResource.period.end = Helper.formatDate(updates.EndDate);
        }

        return existingResource;
    }

}
