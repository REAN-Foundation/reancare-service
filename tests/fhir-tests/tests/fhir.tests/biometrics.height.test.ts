import { TestLoader } from "../test.loader";
import { BiometricsHeightMapper } from "../test.data.mapper/biometrics.height.ehr.mapper";
import { PatientMapper } from '../test.data.mapper/patient.ehr.mapper';
import { DoctorMapper } from '../test.data.mapper/doctor.ehr.mapper';

describe('Observation resource: Storage, retrieval', () => {
    it('Given biometrics height domain model, store observation resource to fhir interface, then returned biometrics height details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);
        
        var model = BiometricsHeightMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;

        var biometricsHeightEhirId = await TestLoader.BiometricsHeightStore.add(model);
        var biometricsHeightFhirResource = await TestLoader.BiometricsHeightStore.getById(biometricsHeightEhirId);

        //Assertions

        var extractedPatientEhrId = biometricsHeightFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedUnit = biometricsHeightFhirResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = biometricsHeightFhirResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(model.RecordDate);

        var extractedRecordedByEhrId = biometricsHeightFhirResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsHeight = biometricsHeightFhirResource.component[0].valueQuantity.value;
        expect(extractedBiometricsHeight).toEqual(model.BodyHeight);

        // For now just check if Visit Id exists
        var extractedVisitId = biometricsHeightFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update biometrics height resource, then updated biometrics height details are returned.', async () => {

        var model = BiometricsHeightMapper.convertJsonObjectToDomainModel();
        var biometricsHeightEhirId = await TestLoader.BiometricsHeightStore.add(model);

        var expectedRecordDate = '2022-03-03';
        model.RecordDate = new Date(expectedRecordDate);
        model.BodyHeight = 154;
        model.Unit = "cm";

        var updatedResource = await TestLoader.BiometricsHeightStore.update(biometricsHeightEhirId, model);

        //Assertions
        var extractedUnit = updatedResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = updatedResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedRecordedByEhrId = updatedResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsHeight = updatedResource.component[0].valueQuantity.value;
        expect(extractedBiometricsHeight).toEqual(model.BodyHeight);
    });

    it('Delete biometrics weight resource, then empty resource is returned for next query.', async () => {

        var model = BiometricsHeightMapper.convertJsonObjectToDomainModel();
        var biometricsHeightEhirId = await TestLoader.BiometricsHeightStore.add(model);
        var heightFhirResource = await TestLoader.BiometricsHeightStore.getById(biometricsHeightEhirId);

        //Before deletetion
        expect(heightFhirResource).toBeTruthy();

        //Delete
        await TestLoader.BiometricsHeightStore.delete(biometricsHeightEhirId);

        //Query after deletion
        var deletedHeightFhirResource = await TestLoader.BiometricsHeightStore.getById(biometricsHeightEhirId);

        //Assertions
        expect(deletedHeightFhirResource).toBeFalsy();

    });
});
