import { MedicationConsumptionDomainModel } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';
import { GcpHelper } from './helper.gcp';
import { healthcare_v1 } from 'googleapis';
import { IMedicationConsumptionStore } from '../../../../interfaces/medication.consumption.store.interface';
import { Helper } from '../../../../../../common/helper';

////////////////////////////////////////////////////////////////////////////////

export class GcpMedicationConsumptionStore implements IMedicationConsumptionStore {

    create = async (model: MedicationConsumptionDomainModel): Promise<any> => {
        var body = this.createMedicationConsumptionFhirResource(model);
        const resourceType = 'MedicationAdministration';
        var id = await GcpHelper.addResource(body, resourceType);
        return id;
    };

    getById = async (resourceId: string): Promise<any> => {
        const resourceType = 'MedicationAdministration';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        return data;
    };
    
    update = async (resourceId:string, updates: MedicationConsumptionDomainModel): Promise<any> => {
        const resourceType = 'MedicationAdministration';
        var data = await GcpHelper.getResourceById(resourceId, resourceType);
        const body: healthcare_v1.Schema$HttpBody = this.updateMedicationFhirResource(updates, data);
        var data = await GcpHelper.updateResource(resourceId, resourceType, body);
        return data;
    };

    delete = async (resourceId: string): Promise<any> => {
        const resourceType = 'MedicationAdministration';
        await GcpHelper.deleteResource(resourceId, resourceType);
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

        var doseValue = Helper.parseIntegerFromString(model.Dose.toString()) ?? 1;
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
                    "value"  : doseValue,
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

        var doseValue = Helper.parseIntegerFromString(updates.Dose.toString()) ?? 1;
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
                    "value"  : doseValue,
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
