import { Logger } from '../../../../../../common/logger';
import { OrganizationDomainModel } from '../../../../../../domain.types/organization/organization.domain.model';
import { IClinicOrganizationStore } from '../../../../interfaces/clinic.organization.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpClinicOrganizationStore implements IClinicOrganizationStore {

    create = async (model: OrganizationDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createClinicOrganizationFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Organization', requestBody: body };
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
            const resourceType = 'Organization';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            return data;
            
        } catch (error) {
            
            if (error.Message != null) {
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
    
    search = async (filter: any): Promise<any> => {
        throw new Error(`Method not implemented. ${filter}`);
    };

    update = async (resourceId:string, updates: OrganizationDomainModel): Promise<any> => {

        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'Organization';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data:any = existingResource.data;
            //delete data.id; //Remove id from the resource
            
            //Construct updated body
            const body: healthcare_v1.Schema$HttpBody = this.updateClinicOrganizationFhirResource(updates, data);
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
            const resourceType = 'Organization';

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

    private createClinicOrganizationFhirResource(model: OrganizationDomainModel): any {

        var resource = {
            resourceType : "Organization",
            id           : "1313222xyz",
            type         : [
                {
                    text : "clinic"
                }
            ],
            
            telecom : []
        };

        if (model.Name != null) {
            resource['name'] = model.Name;
        }

        if (model.ContactPhone != null) {
            resource.telecom.push({
                system : "phone",
                use    : "mobile",
                value  : model.ContactPhone
            });
        }
        if (model.ContactEmail != null) {
            resource.telecom.push({
                system : "email",
                value  : model.ContactEmail
            });
        }
        
        if (model.AddressIds != null) {
            resource['address'] = [
                {
                    id     : model.AddressIds,
                    period : {
                        start : model.OperationalSince
                    }

                }
            ];
        }

        if (model.IsHealthFacility != null) {
            resource['active'] = model.IsHealthFacility;
        }

        if (model.About != null) {
            resource['extension'] = [{
                url         : "http://example.org/fhir/StructureDefinition/hospital",
                valueString : model.About }];
        }

        return resource;
    }

    //#endregion
    private updateClinicOrganizationFhirResource(updates: OrganizationDomainModel, existingResource: any): any {

        existingResource.resourceType = "Organization";

        existingResource.telecom = [];
        
        if (updates.Name != null) {
            existingResource['name'] = updates.Name;
        }

        if (updates.ContactPhone != null) {
            existingResource.telecom.push({
                system : "phone",
                use    : "mobile",
                value  : updates.ContactPhone
            });
        }
        if (updates.ContactEmail != null) {
            existingResource.telecom.push({
                system : "email",
                value  : updates.ContactEmail
            });
        }

        if (updates.AddressIds != null) {
            existingResource['address'] = [
                {
                    id     : updates.AddressIds[0],
                    period : {
                        start : updates.OperationalSince
                    }

                }
            ];
        }

        if (updates.IsHealthFacility != null) {
            existingResource['active'] = updates.IsHealthFacility;
        }

        if (updates.About != null) {
            existingResource['extension'] = [{
                url         : "http://example.org/fhir/StructureDefinition/hospital",
                valueString : updates.About }];
        }

        return existingResource;
    }

    //#endregion

}
