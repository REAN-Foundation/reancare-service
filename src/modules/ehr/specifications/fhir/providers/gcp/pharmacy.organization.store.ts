import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';
import { OrganizationDomainModel } from '../../../../../../domain.types/organization/organization.domain.model';
import { IPharmacyOrganizationStore } from '../../../../interfaces/pharmacy.organization.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class GcpPharmacyOrganizationStore implements IPharmacyOrganizationStore {

    create = async (model: OrganizationDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createPharmacyOrganizationFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Organization', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;

            //var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);

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
            //var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);
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

    update = async (resourceId: string, updates: OrganizationDomainModel): Promise<any> => {

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
            const body: healthcare_v1.Schema$HttpBody = this.updatePharmacyOrganizationFhirResource(updates, data);
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

    private createPharmacyOrganizationFhirResource(model: OrganizationDomainModel): any {

        var resource = {
            resourceType : "Organization",
            id           : "1313222xyz",
            name         : model.Name,
            type         : [
                {
                    text : "clinic"
                }
            ],
            
            telecom : [],
            address : []
        };

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

        if (model.Address != null) {
            var address = {
                line       : [],
                city       : model.Address.City ?? '',
                district   : model.Address.District ?? '',
                postalCode : model.Address.PostalCode ?? ''
            };
            if (model.Address.AddressLine != null) {
                address.line.push(model.Address.AddressLine);
            }
            resource.address.push(address);
        }
        return resource;
    }

    //#endregion
    private updatePharmacyOrganizationFhirResource(updates: OrganizationDomainModel, existingResource: any): any {

        existingResource.resourceType = "Organization";

        if (updates.Name != null) {
            var str = updates.Name;
            existingResource.name = str;
        }

        if (updates.ContactPhone != null) {
            for (var i = 0; i < existingResource.telecom.length; i++) {
                if (existingResource.telecom[i].system === 'phone') {
                    existingResource.telecom[i].value = updates.ContactPhone;
                }
            }
        }
        if (updates.ContactEmail != null) {
            for (var i = 0; i < existingResource.telecom.length; i++) {
                if (existingResource.telecom[i].system === 'email') {
                    existingResource.telecom[i].value = updates.ContactEmail;
                }
            }
        }

        if (updates.Address != null) {
            var address = {
                line       : [],
                city       : updates.Address.City ?? '',
                district   : updates.Address.District ?? '',
                postalCode : updates.Address.PostalCode ?? ''
            };
            if (updates.Address.AddressLine != null) {
                address.line.push(updates.Address.AddressLine);
            }
            if (existingResource.address.length > 0) {
                existingResource.address.pop();
            }
            existingResource.address.push(address);
        }
        return existingResource;
    }

    //#endregion

}
