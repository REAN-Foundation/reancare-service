import { TestLoader } from "../test.loader";
import { BiometricsWeightMapper } from "../test.data.mapper/biometrics.weight.ehr.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";

describe('Observation resource: Storage, retrieval', () => {
    it('Given biometrics weight domain model, store observation resource to fhir interface, then returned biometrics weight details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);
    
        var model = BiometricsWeightMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;

        var biometricsWeightEhirId = await TestLoader.BiometricsWeightStore.add(model);
        var biometricsWeightFhirResource = await TestLoader.BiometricsWeightStore.getById(biometricsWeightEhirId);

        //Assertions

        var extractedPatientEhrId = biometricsWeightFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);
 
        var extractedUnit = biometricsWeightFhirResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = biometricsWeightFhirResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(model.RecordDate);

        var extractedRecordedByEhrId = biometricsWeightFhirResource.performer[0].reference.split('/')[1];
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsWeight = biometricsWeightFhirResource.component[0].valueQuantity.value;
        expect(extractedBiometricsWeight).toEqual(model.BodyWeight);

        // For now just check if Visit Id exists
        var extractedVisitId = biometricsWeightFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update biometrics weight resource, then updated patient details are returned.', async () => {

        var model = BiometricsWeightMapper.convertJsonObjectToDomainModel();
        var biometricsWeightEhirId = await TestLoader.BiometricsWeightStore.add(model);

        var expectedRecordDate = '2022-03-03';
        model.RecordDate = new Date(expectedRecordDate);
        model.BodyWeight = 74;
        model.Unit = "Kg";

        var updatedResource = await TestLoader.BiometricsWeightStore.update(biometricsWeightEhirId, model);

        //Assertions
        var extractedUnit = updatedResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = updatedResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedRecordedByEhrId = updatedResource.performer[0].reference.split('/')[1];
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsWeight = updatedResource.component[0].valueQuantity.value;
        expect(extractedBiometricsWeight).toEqual(model.BodyWeight);
    });

    it('Delete biometrics weight resource, then empty resource is returned for next query.', async () => {

        var model = BiometricsWeightMapper.convertJsonObjectToDomainModel();
        var biometricsWeightEhirId = await TestLoader.BiometricsWeightStore.add(model);
        var weightFhirResource = await TestLoader.BiometricsWeightStore.getById(biometricsWeightEhirId);

        //Before deletetion
        expect(weightFhirResource).toBeTruthy();

        //Delete
        await TestLoader.BiometricsWeightStore.delete(biometricsWeightEhirId);

        //Query after deletion
        var deletedWeightFhirResource = await TestLoader.BiometricsWeightStore.getById(biometricsWeightEhirId);

        //Assertions
        expect(deletedWeightFhirResource).toBeFalsy();

    });
});
