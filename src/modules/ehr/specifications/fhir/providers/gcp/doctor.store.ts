import { Helper } from '../../../../../../common/helper';
import { Logger } from '../../../../../../common/logger';
import { DoctorDomainModel } from '../../../../../../domain.types/users/doctor/doctor.domain.model';
import { IDoctorStore } from '../../../../interfaces/doctor.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { FhirHelper } from '../../fhir.helper';
import { DoctorSearchFilters } from '../../../../../../domain.types/users/doctor/doctor.search.types';

////////////////////////////////////////////////////////////////////////////////

export class GcpDoctorStore implements IDoctorStore {

    create = async (model: DoctorDomainModel): Promise<any> => {
        var body = this.createDoctorFhirResource(model);
        const resourceType = 'Practitioner';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Practitioner';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    search = async (filter: DoctorSearchFilters): Promise<any> => {
        var str = JSON.stringify(filter, null, 2);
        Logger.instance().log(`Created FHIR resource ${str}`);
    };

    update = async (resourceId:string, updates: DoctorDomainModel): Promise<any> => {
        const resourceType = 'Practitioner';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateDoctorFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Practitioner';
        await GcpHelper.deleteResource(resourceId, resourceType);
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
        };

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
