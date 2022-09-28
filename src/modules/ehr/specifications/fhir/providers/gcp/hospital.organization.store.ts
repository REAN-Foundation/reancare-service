import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { IHospitalOrganizationStore } from '../../../../interfaces/hospital.organization.store.interface';
import { OrganizationDomainModel } from '../../../../../../domain.types/general/organization/organization.domain.model';

////////////////////////////////////////////////////////////////////////////////

export class GcpHospitalOrganizationStore implements IHospitalOrganizationStore {

    create = async (model: OrganizationDomainModel): Promise<any> => {
        var body = this.createHospitalFhirResource(model);
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
        const body: healthcare_v1.Schema$HttpBody = this.updateHospitalFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Organization';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createHospitalFhirResource(model: OrganizationDomainModel): any {

        var resource = {
            resourceType : "Organization",
            id           : "1313222xyz",
            type         : [
                {
                    text : "hospital"
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

    updateHospitalFhirResource(updates: OrganizationDomainModel, existingResource: any): any {

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
