import { TestLoader } from "../test.loader";
import { BodyTemperatureMapper } from "../test.data.mapper/body.temperature.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";

describe('Observation resource: Storage, retrieval', () => {
    it('Given temperature domain model, store observation resource to fhir interface, then returned temperature details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);
        
        var model = BodyTemperatureMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;

        var temperatureEhirId = await TestLoader.TemperatureStore.add(model);
        var temperatureFhirResource = await TestLoader.TemperatureStore.getById(temperatureEhirId);

        //Assertions

        var extractedPatientEhrId = temperatureFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedUnit = temperatureFhirResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = temperatureFhirResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(model.RecordDate);

        var extractedRecordedByEhrId = temperatureFhirResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedTemperature = temperatureFhirResource.component[0].valueQuantity.value;
        expect(extractedTemperature).toEqual(model.BodyTemperature);

        // For now just check if Visit Id exists
        var extractedVisitId = temperatureFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update biometrics temperature resource, then updated patient details are returned.', async () => {

        var model = BodyTemperatureMapper.convertJsonObjectToDomainModel();
        var temperatureEhirId = await TestLoader.TemperatureStore.add(model);

        var expectedRecordDate = '2022-03-03';
        model.RecordDate = new Date(expectedRecordDate);
        model.BodyTemperature = 99;
        model.Unit = "°F";

        var updatedResource = await TestLoader.TemperatureStore.update(temperatureEhirId, model);

        //Assertions
        var extractedUnit = updatedResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = updatedResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedRecordedByEhrId = updatedResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsWeight = updatedResource.component[0].valueQuantity.value;
        expect(extractedBiometricsWeight).toEqual(model.BodyTemperature);
    });

    it('Delete biometrics temperature resource, then empty resource is returned for next query.', async () => {

        var model = BodyTemperatureMapper.convertJsonObjectToDomainModel();
        var temperatureEhirId = await TestLoader.TemperatureStore.add(model);
        var temperatureFhirResource = await TestLoader.TemperatureStore.getById(temperatureEhirId);

        //Before deletetion
        expect(temperatureFhirResource).toBeTruthy();

        //Delete
        await TestLoader.TemperatureStore.delete(temperatureEhirId);

        //Query after deletion
        var deletedtemperatureFhirResource = await TestLoader.TemperatureStore.getById(temperatureEhirId);

        //Assertions
        expect(deletedtemperatureFhirResource).toBeFalsy();

    });
});
