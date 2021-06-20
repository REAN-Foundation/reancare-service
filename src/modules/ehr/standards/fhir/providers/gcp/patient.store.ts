/// <reference path = "../../types/patient.types.ts" />

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
            var resourceStr = JSON.stringify(resource, null, 2);
            console.log(`Created FHIR resource ${resourceStr}`);
            return resource;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    private createPatientFhirResource(model: PatientDomainModel): any {
        const resource = {
            resourceType : "Patient",
            name: [
                {
                    use: "official",
                    given: ["KK", "A"],
                    family: "Mhetre",
                    prefix: [
                        "Mr."
                      ]
                }
            ],
            gender: "male",
            birthDate: "1975-12-12",
            telecom: [
                {
                    system: "phone",
                    use: "mobile",
                    value: "+91 8434343552"
                },
                {
                    system: "email",
                    value: "patient@gmail.com"
                }
            ],
            address: [
                {
                    line: [
                        "patient_address_first_line",
                        "patient_address_second_line"
                    ],
                    city: "Pune",
                    district: "Pune",
                    postalCode: "412307"
                }
            ]
        };
        return resource;
    }

    search = async (filter: any): Promise<any> => {};

    getById = async (id: string): Promise<any> => {};

    update = async (updates: any): Promise<any> => {};

    delete = async (id: string): Promise<any> => {};
}

