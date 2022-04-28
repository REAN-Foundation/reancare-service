import { TestLoader } from "../test.loader";
import { BloodPressureMapper } from "../test.data.mapper/blood.pressure.ehr.mapper";
import { PatientMapper } from  '../test.data.mapper/patient.ehr.mapper';
import { DoctorMapper } from '../test.data.mapper/doctor.ehr.mapper';
import { Logger } from "../../../../common/logger";

describe('Observation resource: Storage, retrieval', () => {
    it('Given blood pressure domain model, store observation resource to fhir interface, then returned blood pressure details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);
        
        var model = BloodPressureMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;

        var bloodPressureEhirId = await TestLoader.BloodPressureStore.add(model);
        var bloodPressureFhirResource = await TestLoader.BloodPressureStore.getById(bloodPressureEhirId);
        Logger.instance().log(`blood pressure resource: ${JSON.stringify(bloodPressureFhirResource)}`);

        //Assertions

        var extractedPatientEhrId = bloodPressureFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedUnit = bloodPressureFhirResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = bloodPressureFhirResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(model.RecordDate);

        var extractedRecordedByEhrId = bloodPressureFhirResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBloodPressureSystolic = bloodPressureFhirResource.component[0].valueQuantity.value;
        expect(extractedBloodPressureSystolic).toEqual(model.Systolic);

        var extractedBloodPressureDiastolic = bloodPressureFhirResource.component[1].valueQuantity.value;
        expect(extractedBloodPressureDiastolic).toEqual(model.Diastolic);

        // For now just check if Visit Id exists
        var extractedVisitId = bloodPressureFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update biometrics blood pressure resource, then updated patient details are returned.', async () => {

        var model = BloodPressureMapper.convertJsonObjectToDomainModel();
        var bloodPressureEhirId = await TestLoader.BloodPressureStore.add(model);

        var expectedRecordDate = '1999-01-03';
        model.RecordDate = new Date(expectedRecordDate);
        model.Systolic = 112;
        model.Diastolic = 74;
        model.Unit = "mmHg";

        var updatedResource = await TestLoader.BloodPressureStore.update(bloodPressureEhirId, model);

        //Assertions
        var extractedUnit = updatedResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = updatedResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedRecordedByEhrId = updatedResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBloodPressureSystolic = updatedResource.component[0].valueQuantity.value;
        expect(extractedBloodPressureSystolic).toEqual(model.Systolic);

        var extractedBloodPressureDiastolic = updatedResource.component[1].valueQuantity.value;
        expect(extractedBloodPressureDiastolic).toEqual(model.Diastolic);
    });

    it('Delete biometrics blood pressure resource, then empty resource is returned for next query.', async () => {

        var model = BloodPressureMapper.convertJsonObjectToDomainModel();
        var bloodPressureEhirId = await TestLoader.BloodPressureStore.add(model);
        var bloodPressureFhirResource = await TestLoader.BloodPressureStore.getById(bloodPressureEhirId);

        //Before deletetion
        expect(bloodPressureFhirResource).toBeTruthy();

        //Delete
        await TestLoader.BloodPressureStore.delete(bloodPressureEhirId);

        //Query after deletion
        var deletedBPFhirResource = await TestLoader.BloodPressureStore.getById(bloodPressureEhirId);

        //Assertions
        expect(deletedBPFhirResource).toBeFalsy();

    });
});
