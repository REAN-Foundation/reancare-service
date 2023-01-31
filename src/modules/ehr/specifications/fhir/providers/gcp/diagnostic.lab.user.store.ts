import { Helper } from '../../../../../../common/helper';
import { IDiagnosticLabUserStore } from '../../../../interfaces/diagnostic.lab.user.store.interface';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { DiagnosticLabUserDomainModel } from '../../../../../../domain.types/users/diagnostic.lab.user/diagnostic.lab.user.domain.model';

////////////////////////////////////////////////////////////////////////////////

export class GcpDiagnosticLabUserStore implements IDiagnosticLabUserStore {

    create = async (model: DiagnosticLabUserDomainModel): Promise<any> => {
        var body = this.createDiagnosticLabUserFhirResource(model);
        const resourceType = 'Practitioner';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'Practitioner';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };

    update = async (resourceId:string, updates: DiagnosticLabUserDomainModel): Promise<any> => {
        const resourceType = 'Practitioner';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateDiagnosticLabUserFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'Practitioner';
        await GcpHelper.deleteResource(resourceId, resourceType);
    };

    //#region Private methods

    private createDiagnosticLabUserFhirResource(model: DiagnosticLabUserDomainModel): any {

        var nameObj = this.getDiagnosticLabUserFhirName(model);

        var resource = {
            resourceType : "Practitioner",
            name         : [nameObj],
            gender       : model.Gender != null ? model.Gender.toLowerCase() : 'unknown',
            telecom      : [],
            address      : []
        };

        if (model.BirthDate != null) {
            var str = Helper.formatDate(model.BirthDate);
            resource['birthDate'] = str;
        }

        if (model.Phone != null) {
            resource.telecom.push({
                system : "phone",
                use    : "mobile",
                value  : model.Phone
            });
        }
        if (model.Email != null) {
            resource.telecom.push({
                system : "email",
                value  : model.Email
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

    private getDiagnosticLabUserFhirName(model: DiagnosticLabUserDomainModel) {

        var givenNames = [];

        if (model.FirstName != null) {
            givenNames.push(model.FirstName);
        } else {
            givenNames.push('');
        }
        if (model.MiddleName != null) {
            givenNames.push(model.MiddleName);
        } else {
            givenNames.push('');
        }

        var familyName = model.LastName != null ? model.LastName : '';
        var prefixes = [];
        if (model.Prefix != null) {
            prefixes.push(model.Prefix);
        }

        var nameObj = {
            use    : "official",
            given  : givenNames,
            family : familyName,
            prefix : prefixes
        };
        return nameObj;
    }

    private updateDiagnosticLabUserFhirResource(updates: DiagnosticLabUserDomainModel, existingResource: any): any {

        existingResource.resourceType = "Practitioner";

        if (existingResource.name.length === 0) {
            existingResource.name = this.getDiagnosticLabUserFhirName(updates);
        }
        else {
            var nameObj = existingResource.name[0];
            if (updates.FirstName != null) {
                if (nameObj.given.length > 0) {
                    nameObj.given[0] = updates.FirstName;
                } else {
                    nameObj.given.push(updates.FirstName);
                }
            }
            if (updates.MiddleName != null) {
                if (nameObj.given.length > 1) {
                    nameObj.given[1] = updates.MiddleName;
                } else {
                    nameObj.given.push(updates.MiddleName);
                }
            }
            if (updates.LastName != null) {
                nameObj.family = updates.LastName;
            }
            if (updates.Prefix != null) {
                nameObj.prefix = [];
                nameObj.prefix.push(updates.Prefix);
            }
            existingResource.name[0] = nameObj;
        }
        if (updates.Gender != null) {
            existingResource.gender = updates.Gender.toLowerCase();
        }
        if (updates.BirthDate != null) {
            var str = Helper.formatDate(updates.BirthDate);
            existingResource.birthDate = str;
        }
        if (updates.Phone != null) {
            for (var i = 0; i < existingResource.telecom.length; i++) {
                if (existingResource.telecom[i].system === 'phone') {
                    existingResource.telecom[i].value = updates.Phone;
                }
            }
        }
        if (updates.Email != null) {
            for (var i = 0; i < existingResource.telecom.length; i++) {
                if (existingResource.telecom[i].system === 'email') {
                    existingResource.telecom[i].value = updates.Email;
                }
            }
        }

        if (updates.Address !== null) {
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
