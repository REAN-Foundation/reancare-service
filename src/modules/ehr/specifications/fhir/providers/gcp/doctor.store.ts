import { Helper } from '../../../../../../common/helper';
import { Logger } from '../../../../../../common/logger';
import { DoctorDomainModel, DoctorSearchFilters } from '../../../../../../data/domain.types/doctor.domain.types';
import { IDoctorStore } from '../../../../interfaces/doctor.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { FhirHelper } from '../../fhir.helper';

////////////////////////////////////////////////////////////////////////////////

export class GcpDoctorStore implements IDoctorStore {

    create = async (model: DoctorDomainModel): Promise<any> => {
        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();

            var body = this.createDoctorFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Practitioner', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;

            //var resourceStr = JSON.stringify(data, null, 2);
            //Logger.instance().log(`Created FHIR resource ${resourceStr}`);

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
            
            const resourceType = 'Practitioner';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;

            //var resourceStr = JSON.stringify(data, null, 2);
            //Logger.instance().log(`Created FHIR resource ${resourceStr}`);

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
    
    search = async (filter: DoctorSearchFilters): Promise<any> => {
        var str = JSON.stringify(filter, null, 2);
        Logger.instance().log(`Created FHIR resource ${str}`);
    };

    update = async (resourceId:string, updates: DoctorDomainModel): Promise<any> => {

        var g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        const resourceType = 'Practitioner';

        //Get the existing resource
        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
        var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
            { name: parent }
        );
        var data:any = existingResource.data;

        //delete data.id; //Remove id from the resource
        
        //Construct updated body
        const body: healthcare_v1.Schema$HttpBody = this.updateDoctorFhirResource(updates, data);
        const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
            name        : parent,
            requestBody : body,
        });
        
        var data: any = updatedResource.data;
        Logger.instance().log(`Updated ${resourceType} resource:\n${updatedResource.data}`);

        return data;
    };

    delete = async (resourceId: string): Promise<any> => {

        var g = await GcpHelper.getGcpClient();
        const c = GcpHelper.getGcpFhirConfig();

        const resourceType = 'Practitioner';

        //Get the existing resource
        const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
        await g.projects.locations.datasets.fhirStores.fhir.delete(
            { name: parent }
        );
    };

    //#region Private methods

    private createDoctorFhirResource(model: DoctorDomainModel): any {

        var nameObj = FhirHelper.getPersonFhirName(model.User.Person);

        var resource = {
            resourceType : "Practitioner",
            name         : [nameObj],
            gender       : model.User.Person.Gender != null ? model.User.Person.Gender.toLowerCase() : 'unknown',
            telecom      : [],
            address      : []
        }
        
        if (model.User.Person.BirthDate != null) {
            var str = Helper.formatDate(model.User.Person.BirthDate);
            resource['birthDate'] = str;
        }

        if (model.User.Person.Phone != null) {
            resource.telecom.push({
                system : "phone",
                use    : "mobile",
                value  : model.User.Person.Phone
            });
        }
        if (model.User.Person.Email != null) {
            resource.telecom.push({
                system : "email",
                value  : model.User.Person.Email
            });
        }
        if (model.Addresses != null) {
            for (var a of model.Addresses) {
                var address = {
                    line       : [],
                    city       : a.City ?? '',
                    district   : a.District ?? '',
                    postalCode : a.PostalCode ?? ''
                };
                if (a.AddressLine != null) {
                    address.line.push(a.AddressLine);
                }
                resource.address.push(address);
            }
        }
        return resource;
    }

    private updateDoctorFhirResource(updates: DoctorDomainModel, existingResource: any): any {

        existingResource.resourceType = "Practitioner";

        if (existingResource.name.length === 0) {
            existingResource.name = FhirHelper.getPersonFhirName(updates.User.Person);
        }
        else {
            var nameObj = existingResource.name[0];
            if (updates.User.Person.FirstName !== null) {
                if (nameObj.given.length > 0) {
                    nameObj.given[0] = updates.User.Person.FirstName;
                } else {
                    nameObj.given.push(updates.User.Person.FirstName);
                }
            }
            if (updates.User.Person.MiddleName !== null) {
                if (nameObj.given.length > 1) {
                    nameObj.given[1] = updates.User.Person.MiddleName;
                } else {
                    nameObj.given.push(updates.User.Person.MiddleName);
                }
            }
            if (updates.User.Person.LastName !== null) {
                nameObj.family = updates.User.Person.LastName;
            }
            if (updates.User.Person.Prefix !== null) {
                nameObj.prefix = [];
                nameObj.prefix.push(updates.User.Person.Prefix);
            }
            existingResource.name[0] = nameObj;
        }
        if (updates.User.Person.Gender !== null) {
            existingResource.gender = updates.User.Person.Gender.toLowerCase();
        }
        if (updates.User.Person.BirthDate !== null) {
            var str = Helper.formatDate(updates.User.Person.BirthDate);
            existingResource.birthDate = str;
        }
        if (updates.User.Person.Phone != null) {
            for (var i = 0; i < existingResource.telecom.length; i++) {
                if (existingResource.telecom[i].system === 'phone') {
                    existingResource.telecom[i].value = updates.User.Person.Phone;
                }
            }
        }
        if (updates.User.Person.Email != null) {
            for (var i = 0; i < existingResource.telecom.length; i++) {
                if (existingResource.telecom[i].system === 'email') {
                    existingResource.telecom[i].value = updates.User.Person.Email;
                }
            }
        }

        if (updates.Addresses !== null && updates.Addresses.length > 0) {
            var a = updates.Addresses[0];
            var address = {
                line       : [],
                city       : a.City ?? '',
                district   : a.District ?? '',
                postalCode : a.PostalCode ?? ''
            };
            if (a.AddressLine !== null) {
                address.line.push(a.AddressLine);
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
