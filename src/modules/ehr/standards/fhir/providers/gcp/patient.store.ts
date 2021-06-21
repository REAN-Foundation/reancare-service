/// <reference path = "../../types/patient.types.ts" />

import { Helper } from '../../../../../../common/helper';
import { PatientDomainModel } from '../../../../../../data/domain.types/patient.domain.types';
import { IPatientStore } from '../../../../interfaces/patient.store.interface';
import { GcpStorageService as g } from './storage.service';

////////////////////////////////////////////////////////////////////////////////

export class PatientStoreGCP implements IPatientStore {

    create = async (model: PatientDomainModel): Promise<any> => {
        try {
            var body = this.createPatientFhirResource(model);
            const parent = `projects/${g.projectId}/locations/${g.cloudRegion}/datasets/${g.datasetId}/fhirStores/${g.fhirStoreId}`;
            const request = { parent, type: 'Patient', requestBody: body };
            const resource = await g.healthcare.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;
            var resourceStr = JSON.stringify(data, null, 2);
            console.log(`Created FHIR resource ${resourceStr}`);
            return data.id;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    getById = async (resourceId: string): Promise<any> => {
        try {
            const resourceType = 'Patient';
            const parent = `projects/${g.projectId}/locations/${g.cloudRegion}/datasets/${g.datasetId}/fhirStores/${g.fhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.healthcare.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            var resourceStr = JSON.stringify(data, null, 2);
            console.log(`Created FHIR resource ${resourceStr}`);
            return data;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };
    
    search = async (filter: any): Promise<any> => {};

    update = async (updates: any): Promise<any> => {};

    delete = async (id: string): Promise<any> => {};

     //#region Private methods

    private createPatientFhirResource(model: PatientDomainModel): any {

        var givenNames = [];
        if(model.FirstName != null) {
            givenNames.push(model.FirstName);
        }
        if(model.MiddleName != null) {
            givenNames.push(model.MiddleName);
        }
        var faamilyName = model.LastName != null ? model.LastName : '';
        var prefixes = [];
        if(model.Prefix != null) {
            prefixes.push(model.Prefix);
        }

        var resource = {
            resourceType : "Patient",
            name: [
                {
                    use: "official",
                    given: givenNames,
                    family: faamilyName,
                    prefix: prefixes
                }
            ],
            gender: model.Gender != null ? model.Gender.toLowerCase() : 'unknown',
            telecom: [],
            address: []
        }
        
        if(model.BirthDate != null) {
            var str = Helper.formatDate(model.BirthDate);
            resource['birthDate'] = str;
        }

        if(model.Phone != null) {
            resource.telecom.push({
                system: "phone",
                use: "mobile",
                value: model.Phone
            });
        }
        if(model.Email != null) {
            resource.telecom.push({
                system: "email",
                value: model.Email
            });
        }
        if(model.Address != null) {
            var address = {
                line: [],
                city: model.Address.City ?? '',
                district: model.Address.District ?? '',
                postalCode: model.Address.PostalCode ?? ''
            };
            if(model.Address.AddressLine != null) {
                address.line.push(model.Address.AddressLine);
            }
            resource.address.push(address);
        }
        return resource;
    }

     //#endregion
}

