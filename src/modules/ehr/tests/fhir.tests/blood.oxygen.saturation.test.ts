import { TestLoader } from "../test.loader";
import { BloodOxygenSaturationMapper } from "../test.data.mapper/blood.oxygen.saturation.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";

describe('Observation resource: Storage, retrieval', () => {
    it('Given blood pressure domain model, store observation resource to fhir interface, then returned blood pressure details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);

        var model = BloodOxygenSaturationMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;
        
        var bloodOxygenSaturationEhirId = await TestLoader.BloodOxygenSaturationStore.add(model);
        var bloodOxygenFhirResource = await TestLoader.BloodOxygenSaturationStore.getById(bloodOxygenSaturationEhirId);

        //Assertions

        var extractedPatientEhrId = bloodOxygenFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedUnit = bloodOxygenFhirResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = bloodOxygenFhirResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(model.RecordDate);

        var extractedRecordedByEhrId = bloodOxygenFhirResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        // For now just check if Visit Id exists
        var extractedVisitId = bloodOxygenFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update BloodOxygenSaturation resource, then updated BloodOxygenSaturation details are returned.', async () => {

        var model = BloodOxygenSaturationMapper.convertJsonObjectToDomainModel();
        var bloodOxygenSaturationEhirId = await TestLoader.BloodOxygenSaturationStore.add(model);

        var expectedRecordDate = '1999-01-03';
        model.RecordDate = new Date(expectedRecordDate);
        model.BloodOxygenSaturation = 92;
        model.Unit = "%";

        var updatedResource = await TestLoader.BloodOxygenSaturationStore.update(bloodOxygenSaturationEhirId, model);

        // Assertions
        var extractedPatientUserId = updatedResource.PatientUserId;
        expect(extractedPatientUserId).toEqual(extractedPatientUserId);
      
        var extractedUnit = updatedResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordByUserId = updatedResource.performer[0].id;
        expect(extractedRecordByUserId).toEqual(extractedRecordByUserId);

        var extractedRecordDate = updatedResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedBloodOxygenSaturation = updatedResource.component[0].valueQuantity.value;
        expect(extractedBloodOxygenSaturation).toEqual(model.BloodOxygenSaturation);
        
    });

    it('Delete BloodOxygenSaturation resource, then empty resource is returned for next query.', async () => {

        var model = BloodOxygenSaturationMapper.convertJsonObjectToDomainModel();
        var bloodOxygenEhirId = await TestLoader.BloodOxygenSaturationStore.add(model);
        var bloodOxygenFhirResource = await TestLoader.BloodOxygenSaturationStore.getById(bloodOxygenEhirId);

        //Before deletetion
        expect(bloodOxygenFhirResource).toBeTruthy();

        //Delete
        await TestLoader.BloodOxygenSaturationStore.delete(bloodOxygenEhirId);

        //Query after deletion
        var deletedbloodOxygenFhirResource = await TestLoader.BloodOxygenSaturationStore.getById(bloodOxygenEhirId);

        //Assertions
        expect(deletedbloodOxygenFhirResource).toBeFalsy();

    });

});
