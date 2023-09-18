import { TestLoader } from "../test.loader";
import { BloodGlucoseMapper } from "../test.data.mapper/blood.glucose.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";

describe('Observation resource: Storage, retrieval', () => {
    it('Given blood sugar domain model, store observation resource to fhir interface, then returned blood sugar details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);
        
        var model = BloodGlucoseMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;

        var bloodSugarEhirId = await TestLoader.BloodGlucoseStore.add(model);
        var bloodSugarFhirResource = await TestLoader.BloodGlucoseStore.getById(bloodSugarEhirId);

        //Assertions

        var extractedPatientEhrId = bloodSugarFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedUnit = bloodSugarFhirResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = bloodSugarFhirResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(model.RecordDate);

        var extractedRecordedByEhrId = bloodSugarFhirResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBloodGlucose = bloodSugarFhirResource.component[0].valueQuantity.value;
        expect(extractedBloodGlucose).toEqual(model.BloodGlucose);

        // For now just check if Visit Id exists
        var extractedVisitId = bloodSugarFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update blood sugar resource, then updated patient details are returned.', async () => {

        var model = BloodGlucoseMapper.convertJsonObjectToDomainModel();
        var bloodSugarEhirId = await TestLoader.BloodGlucoseStore.add(model);

        var expectedRecordDate = '2022-03-28';
        model.RecordDate = new Date(expectedRecordDate);
        model.BloodGlucose = 126;
        model.Unit = "mg/dL";

        var updatedResource = await TestLoader.BloodGlucoseStore.update(bloodSugarEhirId, model);

        //Assertions
        var extractedUnit = updatedResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = updatedResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedRecordedByEhrId = updatedResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsWeight = updatedResource.component[0].valueQuantity.value;
        expect(extractedBiometricsWeight).toEqual(model.BloodGlucose);
    });

    it('Delete blood sugar resource, then empty resource is returned for next query.', async () => {

        var model = BloodGlucoseMapper.convertJsonObjectToDomainModel();
        var bloodSugarEhirId = await TestLoader.BloodGlucoseStore.add(model);
        var bloodSugarFhirResource = await TestLoader.BloodGlucoseStore.getById(bloodSugarEhirId);

        //Before deletetion
        expect(bloodSugarFhirResource).toBeTruthy();

        //Delete
        await TestLoader.BloodGlucoseStore.delete(bloodSugarEhirId);

        //Query after deletion
        var deletedbloodSugarFhirResource = await TestLoader.BloodGlucoseStore.getById(bloodSugarEhirId);

        //Assertions
        expect(deletedbloodSugarFhirResource).toBeFalsy();

    });
});
