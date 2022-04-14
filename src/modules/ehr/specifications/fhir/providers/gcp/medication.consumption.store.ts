import { Logger } from '../../../../../../common/logger';
import { MedicationConsumptionDomainModel } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { IMedicationConsumptionStore } from '../../../../interfaces/medication.consumption.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class GcpMedicationConsumptionStore implements IMedicationConsumptionStore {

    add = async (model: MedicationConsumptionDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createMedicationConsumptionFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'MedicationAdministration', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;
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
            const resourceType = 'MedicationAdministration';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            //var resourceStr = JSON.stringify(data, null, 2);
            //console.log(`Created FHIR resource ${resourceStr}`);
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
    
    search(filter ): Promise<any> {
        throw new Error(`Method not implemented. ${filter}`);
    }

    update = async (resourceId:string, updates: MedicationConsumptionDomainModel): Promise<any> => {

        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'MedicationAdministration';

            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data:any = existingResource.data;

            const body: healthcare_v1.Schema$HttpBody = this.updateMedicationFhirResource(updates, data);
            const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
                name        : parent,
                requestBody : body,
            });
            var data: any = updatedResource.data;
            Logger.instance().log(`Updated ${resourceType} resource:\n${updatedResource.data}`);
            return data;

        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }

    };

    delete = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'MedicationAdministration';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            await g.projects.locations.datasets.fhirStores.fhir.delete(
                { name: parent }
            );
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    //#region Private methods

    private createMedicationConsumptionFhirResource(model: MedicationConsumptionDomainModel): any {

        var resource = {
            resourceType : "MedicationAdministration",
            id           : "medadmin0306",
            status       : "in-progress",
            contained    : []

        };

        if (model.PatientUserId != null) {
            resource['subject'] = {
                id   : model.PatientUserId,
                type : "patient"
            };
        }

        if (model.MedicationId != null && model.DrugName != null) {
            
            var drug = {
                resourceType : "Medication",
                id           : model.MedicationId,
                code         : {
                    coding : [
                        {
                            system  : "http://hl7.org/fhir/sid/ndc",
                            code    : "med301",
                            id      : model.DrugId,
                            display : model.DrugName,
                        }
                    ]
                }
            };

            resource.contained.push(drug);
        }

        if (model.Dose != null) {
            resource['dosage'] = {
                "text"  : model.Details,
                "route" : {
                    "coding" : [
                        {
                            "system"  : "http://snomed.info/sct",
                            "code"    : "47625008",
                            "display" : "Intravenous route (qualifier value)"
                        }
                    ]
                },
                "method" : {
                    "text" : "Oral Route"
                },
                "dose" : {
                    "value"  : model.Dose,
                    "unit"   : "mg",
                    "system" : "http://unitsofmeasure.org",
                    "code"   : "mg"
                }
            };
        }

        if (model.TimeScheduleStart != null) {
            resource['effectivePeriod'] = {
                start : model.TimeScheduleStart,
                end   : model.TimeScheduleEnd
            };
        }

        if (model.DrugName != null) {
            resource['medicationCodeableConcept'] = {
                coding : [
                    {
                        system  : "http://snomed.info/sct",
                        code    : model.DrugId,
                        display : model.DrugName
                    }
                ],
                text : model.Details
            };
        }
 
        return resource;
    }
    
    private updateMedicationFhirResource(updates: MedicationConsumptionDomainModel, existingResource: any): any {
        
        existingResource.resourceType = "MedicationAdministration";

        existingResource.contained = [];

        if (updates.MedicationId != null && updates.DrugName != null) {
            
            var drug = {
                resourceType : "Medication",
                id           : updates.MedicationId,
                code         : {
                    coding : [
                        {
                            system  : "http://hl7.org/fhir/sid/ndc",
                            code    : "med301",
                            id      : updates.DrugId,
                            display : updates.DrugName,
                        }
                    ]
                }
            };

            existingResource.contained.push(drug);
        }

        if (updates.Dose != null) {
            existingResource['dosage'] = {
                "text"  : updates.Details,
                "route" : {
                    "coding" : [
                        {
                            "system"  : "http://snomed.info/sct",
                            "code"    : "47625008",
                            "display" : "Intravenous route (qualifier value)"
                        }
                    ]
                },
                "method" : {
                    "text" : "Oral Route"
                },
                "dose" : {
                    "value"  : updates.Dose,
                    "unit"   : "mg",
                    "system" : "http://unitsofmeasure.org",
                    "code"   : "mg"
                }
            };
        }

        if (updates.TimeScheduleStart != null) {
            existingResource['effectivePeriod'] = {
                start : updates.TimeScheduleStart,
                end   : updates.TimeScheduleEnd
            };
        }

        if (updates.DrugName != null) {
            existingResource['medicationCodeableConcept'] = {
                coding : [
                    {
                        system  : "http://snomed.info/sct",
                        code    : updates.DrugId,
                        display : updates.DrugName
                    }
                ],
                text : updates.Details
            };
        }
        return existingResource;
    }

}
