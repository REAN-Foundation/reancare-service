import { healthcare_v1 } from 'googleapis';
import { Helper } from '../../../../../../common/helper';
import { Logger } from '../../../../../../common/logger';
import { PatientDomainModel } from '../../../../../../domain.types/users/patient/patient/patient.domain.model';
import { PatientSearchFilters } from '../../../../../../domain.types/users/patient/patient/patient.search.types';
import { IPatientStore } from '../../../../interfaces/patient.store.interface';
import { FhirHelper } from '../../fhir.helper';
import { GcpHelper } from './helper.gcp';

////////////////////////////////////////////////////////////////////////////////

export class GcpPatientStore implements IPatientStore {

    create = async (model: PatientDomainModel): Promise<any> => {
        var body = this.createPatientFhirResource(model);
        const resourceType = 'Patient';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Patient';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    search = async (filter: PatientSearchFilters): Promise<any> => {
        var str = JSON.stringify(filter, null, 2);
        Logger.instance().log(`Created FHIR resource ${str}`);
    };

    update = async (resourceId:string, updates: PatientDomainModel): Promise<any> => {
        const resourceType = 'Patient';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updatePatientFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Patient';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createPatientFhirResource(model: PatientDomainModel): any {

        var nameObj = FhirHelper.getPersonFhirName(model.User.Person);

        var resource = {
            resourceType : "Patient",
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

    private updatePatientFhirResource(updates: PatientDomainModel, existingResource: any): any {

        existingResource.resourceType = "Patient";

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

        if (updates.Address !== null) {
            var a = updates.Address;
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
