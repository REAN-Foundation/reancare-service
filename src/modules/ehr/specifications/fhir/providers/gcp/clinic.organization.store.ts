import { OrganizationDomainModel } from '../../../../../../domain.types/general/organization/organization.domain.model';
import { IClinicOrganizationStore } from '../../../../interfaces/clinic.organization.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';

////////////////////////////////////////////////////////////////////////////////

export class GcpClinicOrganizationStore implements IClinicOrganizationStore {

    create = async (model: OrganizationDomainModel): Promise<any> => {
        var body = this.createClinicOrganizationFhirResource(model);
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
        const body: healthcare_v1.Schema$HttpBody = this.updateClinicOrganizationFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Organization';
        await GcpHelper.deleteResource(resourceId, resourceType);
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
