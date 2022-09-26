import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { OrganizationDomainModel } from '../../../../../../domain.types/general/organization/organization.domain.model';
import { IPharmacyOrganizationStore } from '../../../../interfaces/pharmacy.organization.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class GcpPharmacyOrganizationStore implements IPharmacyOrganizationStore {

    create = async (model: OrganizationDomainModel): Promise<any> => {
        var body = this.createPharmacyOrganizationFhirResource(model);
        const resourceType = 'Organization';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Organization';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    update = async (resourceId:string, updates: OrganizationDomainModel): Promise<any> => {
        const resourceType = 'Organization';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updatePharmacyOrganizationFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Organization';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createPharmacyOrganizationFhirResource(model: OrganizationDomainModel): any {

        var resource = {
            resourceType : "Organization",
            id           : "1313222xyz",
            name         : "MedPlus Clinic Path",
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
