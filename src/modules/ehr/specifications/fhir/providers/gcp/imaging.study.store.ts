import { Helper } from '../../../../../../common/helper';
import { ImagingStudyDomainModel } from '../../../../../../domain.types/imaging.study/imaging.study.domain.model';
import { IImagingStudyStore } from '../../../../../ehr/interfaces/imaging.study.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';

////////////////////////////////////////////////////////////////////////////////

export class GcpImagingStudyStore implements IImagingStudyStore {

    create = async (model: ImagingStudyDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createImagingStudyFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'ImagingStudy', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;
            var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);
            return data.id;
        } catch (error) {
            Logger.instance().log(`Error:: ${JSON.stringify(error.message, null, 2)}`);
            throw error;
        }
    };

    getById = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'ImagingStudy';
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
            Logger.instance().log(error.message);        }
    };
    
    update = async (resourceId:string, updates: ImagingStudyDomainModel): Promise<any> => {
        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'ImagingStudy';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data:any = existingResource.data;

            //Construct updated body
            const body: healthcare_v1.Schema$HttpBody = this.updateImagingStudyFhirResource(updates, data);
            const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
                name        : parent,
                requestBody : body,
            });
            var data: any = updatedResource.data;
            Logger.instance().log(`Updated ${resourceType} resource:\n ${updatedResource.data}`);
            return data;
      
        } catch (error) {
            Logger.instance().log(`Error:: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    
    };

    delete = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'ImagingStudy';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            await g.projects.locations.datasets.fhirStores.fhir.delete(
                { name: parent }
            );
        }  catch (error) {
            Logger.instance().log(`Error:: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
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
