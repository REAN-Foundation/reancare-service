import { TestLoader } from "../test.loader";
import { MedicationConsumptionMapper } from "../test.data.mapper/medication.consumption.mapper";
import { PatientMapper } from  '../test.data.mapper/patient.ehr.mapper';

describe('medication administration resource: Storage, retrieval', () => {
    it('Given medication consumption domain model, store observation resource to fhir interface, then returned medication consumption details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var model = MedicationConsumptionMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;

        var medicationConsumptionEhrId = await TestLoader.MedicationConsumptionStore.add(model);

        // eslint-disable-next-line max-len
        var medicationConsumptionFhirResource = await TestLoader.MedicationConsumptionStore.getById(medicationConsumptionEhrId);

        //Assertions

        var extractedPatientUserId = medicationConsumptionFhirResource.subject.id;
        expect(extractedPatientUserId).toEqual(model.PatientUserId);

        var extractedMedicationId = medicationConsumptionFhirResource.contained[0].id;
        expect(extractedMedicationId).toEqual(model.MedicationId);

        var extractedDrugOrderId = medicationConsumptionFhirResource.contained[0].code.coding[0].id;
        expect(extractedDrugOrderId).toEqual(model.DrugId);

        var extractedDrugName = medicationConsumptionFhirResource.contained[0].code.coding[0].display;
        expect(extractedDrugName).toEqual(model.DrugName);

        var extractedDose = medicationConsumptionFhirResource.dosage.dose.value;
        expect(extractedDose).toEqual(model.Dose);

        var extractedDetails = medicationConsumptionFhirResource.dosage.text;
        expect(extractedDetails).toEqual(model.Details);

        var extractedTimeScheduleStart = medicationConsumptionFhirResource.effectivePeriod.start;
        expect(extractedTimeScheduleStart).toEqual(model.TimeScheduleStart);

    });

    it('Update medication consumption resource, then updated medication consumption details are returned.', async () => {

        var model = MedicationConsumptionMapper.convertJsonObjectToDomainModel();
        var medicationFhirId = await TestLoader.MedicationConsumptionStore.add(model);

        var expectedStartDate = '2022-03-01T02:00:00.000Z';
        var expectedEndDate = '2022-03-15T02:00:00.000Z';
        model.MedicationId = "73859ba4-a79b-4d28-8a08-3fb0a680a255";
        model.DrugName = "Paracitamol";
        model.DrugId = "POM";
        model.Dose = 500;
        model.Details = "Ajinkya.Mhetre@microsoft.com";
        model.TimeScheduleStart = new Date(expectedStartDate);
        model.TimeScheduleEnd = new Date(expectedEndDate);

        var updatedResource = await TestLoader.MedicationConsumptionStore.update(medicationFhirId, model);

        var extractedMedicationId = updatedResource.contained[0].id;
        expect(extractedMedicationId).toEqual(model.MedicationId);

        var extractedDrugOrderId = updatedResource.contained[0].code.coding[0].id;
        expect(extractedDrugOrderId).toEqual(model.DrugId);

        var extractedDrugName = updatedResource.contained[0].code.coding[0].display;
        expect(extractedDrugName).toEqual(model.DrugName);

        var extractedDose = updatedResource.dosage.dose.value;
        expect(extractedDose).toEqual(model.Dose);

        var extractedDetails = updatedResource.dosage.text;
        expect(extractedDetails).toEqual(model.Details);

        var extractedTimeScheduleStart = updatedResource.effectivePeriod.start;
        expect(extractedTimeScheduleStart).toEqual(expectedStartDate);

        var extractedTimeScheduleEnd = updatedResource.effectivePeriod.end;
        expect(extractedTimeScheduleEnd).toEqual(expectedEndDate);
    });

    it('Delete medication consumption resource, then empty resource is returned for next query.', async () => {

        var model = MedicationConsumptionMapper.convertJsonObjectToDomainModel();
        var medicationFhirId = await TestLoader.MedicationConsumptionStore.add(model);
        var medicationFhirResource = await TestLoader.MedicationConsumptionStore.getById(medicationFhirId);

        //Before deletetion
        expect(medicationFhirResource).toBeTruthy();

        //Delete
        await TestLoader.MedicationConsumptionStore.delete(medicationFhirId);

        //Query after deletion
        var deletedMedicationFhirResource = await TestLoader.MedicationConsumptionStore.getById(medicationFhirId);

        //Assertions
        expect(deletedMedicationFhirResource).toBeFalsy();

    });
});
