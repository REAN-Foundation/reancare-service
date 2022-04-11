import { TestLoader } from "../test.loader";
import { PulseMapper } from "../test.data.mapper/pulse.mapper";
import { PatientMapper } from  '../test.data.mapper/patient.ehr.mapper';
import { DoctorMapper } from '../test.data.mapper/doctor.ehr.mapper';

describe('Observation resource: Storage, retrieval', () => {
    it('Given pulse domain model, store observation resource to fhir interface, then returned pulse details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);

        var model = PulseMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;

        var pulseEhirId = await TestLoader.PulseStore.add(model);
        var pulseFhirResource = await TestLoader.PulseStore.getById(pulseEhirId);

        //Assertions

        var extractedPatientEhrId = pulseFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedUnit = pulseFhirResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = pulseFhirResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(model.RecordDate);

        var extractedRecordedByEhrId = pulseFhirResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedPulse = pulseFhirResource.component[0].valueQuantity.value;
        expect(extractedPulse).toEqual(model.Pulse);

        // For now just check if Visit Id exists
        var extractedVisitId = pulseFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update biometrics pulse resource, then updated patient details are returned.', async () => {

        var model = PulseMapper.convertJsonObjectToDomainModel();
        var biometricsPulseEhirId = await TestLoader.PulseStore.add(model);

        var expectedRecordDate = '2022-03-03';
        model.RecordDate = new Date(expectedRecordDate);
        model.Pulse = 84;
        model.Unit = "bpm";

        var updatedResource = await TestLoader.PulseStore.update(biometricsPulseEhirId, model);

        //Assertions
        var extractedUnit = updatedResource.component[0].valueQuantity.unit;
        expect(extractedUnit).toEqual(model.Unit);

        var extractedRecordDate = updatedResource.effectiveDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedRecordedByEhrId = updatedResource.performer[0].id;
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        var extractedBiometricsPulse = updatedResource.component[0].valueQuantity.value;
        expect(extractedBiometricsPulse).toEqual(model.Pulse);
    });

    it('Delete biometrics pulse resource, then empty resource is returned for next query.', async () => {

        var model = PulseMapper.convertJsonObjectToDomainModel();
        var biometricsPulseEhirId = await TestLoader.PulseStore.add(model);
        var pulseFhirResource = await TestLoader.PulseStore.getById(biometricsPulseEhirId);

        //Before deletetion
        expect(pulseFhirResource).toBeTruthy();

        //Delete
        await TestLoader.PulseStore.delete(biometricsPulseEhirId);

        //Query after deletion
        var deletedWeightFhirResource = await TestLoader.PulseStore.getById(biometricsPulseEhirId);

        //Assertions
        expect(deletedWeightFhirResource).toBeFalsy();

    });
});
