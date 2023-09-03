import { TestLoader } from "../test.loader";
import { BodyWeightMapper } from "../test.data.mapper/body.weight.ehr.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";

describe('Observation resource: Storage, retrieval', () => {
    it('Given biometrics weight domain model, store observation resource to fhir interface, then returned biometrics weight details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);
    
        var model = BodyWeightMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;

        var biometricsWeightEhirId = await TestLoader.BodyWeightStore.add(model);
        var biometricsWeightFhirResource = await TestLoader.BodyWeightStore.getById(biometricsWeightEhirId);

        //Assertions

        var extractedPatientEhrId = biometricsWeightFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);
 
        var extractedUnit = biometricsWeightFhirResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = biometricsWeightFhirResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(model.RecordDate);

        var extractedRecordedByEhrId = biometricsWeightFhirResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsWeight = biometricsWeightFhirResource.component[0].valueQuantity.value;
        expect(extractedBiometricsWeight).toEqual(model.BodyWeight);

        // For now just check if Visit Id exists
        var extractedVisitId = biometricsWeightFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update biometrics weight resource, then updated patient details are returned.', async () => {

        var model = BodyWeightMapper.convertJsonObjectToDomainModel();
        var biometricsWeightEhirId = await TestLoader.BodyWeightStore.add(model);

        var expectedRecordDate = '2022-03-03';
        model.RecordDate = new Date(expectedRecordDate);
        model.BodyWeight = 74;
        model.Unit = "Kg";

        var updatedResource = await TestLoader.BodyWeightStore.update(biometricsWeightEhirId, model);

        //Assertions
        var extractedUnit = updatedResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = updatedResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedRecordedByEhrId = updatedResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsWeight = updatedResource.component[0].valueQuantity.value;
        expect(extractedBiometricsWeight).toEqual(model.BodyWeight);
    });

    it('Delete biometrics weight resource, then empty resource is returned for next query.', async () => {

        var model = BodyWeightMapper.convertJsonObjectToDomainModel();
        var biometricsWeightEhirId = await TestLoader.BodyWeightStore.add(model);
        var weightFhirResource = await TestLoader.BodyWeightStore.getById(biometricsWeightEhirId);

        //Before deletetion
        expect(weightFhirResource).toBeTruthy();

        //Delete
        await TestLoader.BodyWeightStore.delete(biometricsWeightEhirId);

        //Query after deletion
        var deletedWeightFhirResource = await TestLoader.BodyWeightStore.getById(biometricsWeightEhirId);

        //Assertions
        expect(deletedWeightFhirResource).toBeFalsy();

    });
});
