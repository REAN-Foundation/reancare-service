import { Helper } from '../../../../../../common/helper';
import { PharmacistDomainModel } from '../../../../../../domain.types/pharmacist/pharmacist.domain.types';
import { PharmacistSearchFilters } from '../../../../../../domain.types/pharmacist/pharmacist.search.types';
import { GcpHelper } from './helper.gcp';
import { IPharmacistStore } from '../../../../interfaces/pharmacist.store.interface';
import { Logger } from '../../../../../../common/logger';

////////////////////////////////////////////////////////////////////////////////

export class GcpPharmacistStore implements IPharmacistStore {

    add = async (model: PharmacistDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createPharmacistFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'Practitioner', requestBody: body };
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
            const resourceType = 'Practitioner';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            //var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);
            return data;
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    search(filter: PharmacistSearchFilters): Promise<any> {
        throw new Error('Method not implemented.');
    }

    update(id: string, updates: PharmacistDomainModel): Promise<any> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    //#region Private methods

    private createPharmacistFhirResource(model: PharmacistDomainModel): any {

        var resource = {
            resourceType : "Practitioner",
            name         : [
                {
                    use    : "official",
                    given  : givenNames,
                    family : faamilyName,
                    prefix : prefixes
                }
            ],
            gender  : model.Gender != null ? model.Gender.toLowerCase() : 'unknown',
            telecom : [],
            address : []
        };
        
        var givenNames = [];
        if (model.FirstName != null) {
            givenNames.push(model.FirstName);
        }
        if (model.MiddleName != null) {
            givenNames.push(model.MiddleName);
        }
        var faamilyName = model.LastName != null ? model.LastName : '';
        var prefixes = [];
        if (model.Prefix != null) {
            prefixes.push(model.Prefix);
        }

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

    //#endregion

}

