import { Helper } from '../../../../../../common/helper';
import { ImagingStudyDomainModel } from '../../../../../../domain.types/clinical/imaging.study/imaging.study.domain.model';
import { IImagingStudyStore } from '../../../../../ehr/interfaces/imaging.study.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpImagingStudyStore implements IImagingStudyStore {

    create = async (model: ImagingStudyDomainModel): Promise<any> => {
        var body = this.createImagingStudyFhirResource(model);
        const resourceType = 'ImagingStudy';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'ImagingStudy';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    update = async (resourceId:string, updates: ImagingStudyDomainModel): Promise<any> => {
        const resourceType = 'ImagingStudy';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateImagingStudyFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'ImagingStudy';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createImagingStudyFhirResource(model: ImagingStudyDomainModel): any {

        var resource = {
            resourceType : "ImagingStudy",
            id           : "example",
            status       : "available",
            subject      : {
                reference : "Patient/dicom",
            },
            numberOfInstances : 1,
            numberOfSeries    : 1,
            started           : "2022-04-04T11:01:20+03:00",
            series            : [
                {
                    uid      : "2.16.124.113543.6003.2588828330.45298.17418.2723805630",
                    number   : 3,
                    modality : {
                        system : "http://dicom.nema.org/resources/ontology/DCM",
                        code   : "CT"
                    },
                    description : "CT Surview 180",
                    bodySite    : {
                        system  : "http://snomed.info/sct",
                        code    : "67734004",
                        display : "Upper Trunk Structure"
                    },
                    instance : [
                        {
                            uid      : "2.16.124.113543.6003.189642796.63084.16748.2599092903",
                            sopClass : {
                                system : "urn:ietf:rfc:3986",
                                code   : "urn:oid:1.2.840.10008.5.1.4.1.1.2"
                            },
                            number : 1
                        }
                    ]
                }
            ],
        };

        if (model.EhrId != null) {
            resource['subject'] = {
                reference : `Patient/${model.EhrId}`
            };
        }

        if (model.StudyDate != null){
            resource['started'] = Helper.formatDate(model.StudyDate);
        }

        if (model.SeriesCount != null){
            resource['numberOfSeries'] = model.SeriesCount;
        }

        if (model.InstanceCount != null){
            resource['numberOfInstances'] = model.InstanceCount;
        }

        /*if (model.VisitEhirId != null) {
            resource['VisitId'] = model.VisitEhrId
        }*/

        return resource;
    }

    private updateImagingStudyFhirResource(updates: ImagingStudyDomainModel, existingResource: any): any {

        existingResource.resourceType = "ImagingStudy";

        /*if (updates.VisitEhirId != null) {
            existingResource['VisitId'] = updates.VisitEhrId
        }*/

        if (updates.StudyDate != null) {
            existingResource['started'] = Helper.formatDate(updates.StudyDate);
        }

        if (updates.BodySite != null) {
            existingResource.series[0].bodySite.display = updates.BodySite;
        }

        if (updates.SeriesCount != null) {
            existingResource['numberOfSeries'] = updates.SeriesCount;
        }

        if (updates.InstanceCount != null) {
            existingResource['numberOfInstances'] = updates.InstanceCount;
        }

        return existingResource;
    }

}
