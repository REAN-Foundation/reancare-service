import { TestLoader } from "../test.loader";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";
import { DiagnosticConditionMapper } from "../test.data.mapper/diagnostic.condition.mapper";

describe('Condition resource: Storage, retrieval', () => {
    it('Given diagnostic domain model, store condition resource to fhir interface, then returned diagnostic condition details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);
        
        var model = DiagnosticConditionMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.DoctorEhrId = doctorEhrId;

        var diagnosticConditionEhirId = await TestLoader.DiagnosticConditionStore.add(model);

        var diagnosticConditionFhirResource =
            await TestLoader.DiagnosticConditionStore.getById(diagnosticConditionEhirId);

        //Assertions

        var extractedPatientEhrId = diagnosticConditionFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedCondition = diagnosticConditionFhirResource.bodySite[0].coding[0].display;
        expect(extractedCondition).toEqual(model.MedicalCondition.BodySite);

        var extractedRecordDate = diagnosticConditionFhirResource.onsetDateTime;
        expect(extractedRecordDate).toEqual(model.OnsetDate);

        var extractedDescription = diagnosticConditionFhirResource.code.coding[0].display;
        expect(extractedDescription).toEqual(model.MedicalCondition.Description);

        var extractedId = diagnosticConditionFhirResource.id;
        expect(extractedId).toBeTruthy();

    });

    it('Update diagnostic condition resource, then updated diagnostic condition details are returned.', async () => {

        var model = DiagnosticConditionMapper.convertJsonObjectToDomainModel();
        var diagnosticConditionEhirId = await TestLoader.DiagnosticConditionStore.add(model);

        var expectedRecordDate = '2022-01-03';
        model.OnsetDate = new Date(expectedRecordDate);
        model.MedicalCondition.BodySite = "whole body";
        model.MedicalCondition.Description = "fever in whole body";
        model.ClinicalStatus = "active";

        var updatedResource = await TestLoader.DiagnosticConditionStore.update(diagnosticConditionEhirId, model);

        //Assertions
        var extractedPatientEhrId = updatedResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedCondition = updatedResource.bodySite[0].coding[0].display;
        expect(extractedCondition).toEqual(model.MedicalCondition.BodySite);

        var extractedRecordDate = updatedResource.onsetDateTime;
        expect(extractedRecordDate).toEqual(expectedRecordDate);

        var extractedDescription = updatedResource.code.coding[0].display;
        expect(extractedDescription).toEqual(model.MedicalCondition.Description);

        var extractedId = updatedResource.id;
        expect(extractedId).toBeTruthy();

    });

    it('Delete diagnostic condition resource, then empty resource is returned for next query.', async () => {

        var model = DiagnosticConditionMapper.convertJsonObjectToDomainModel();
        var diagnosticConditionEhirId = await TestLoader.DiagnosticConditionStore.add(model);
        var diagnosticConditionFhirResource =
            await TestLoader.DiagnosticConditionStore.getById(diagnosticConditionEhirId);

        //Before deletetion
        expect(diagnosticConditionFhirResource).toBeTruthy();

        //Delete
        await TestLoader.DiagnosticConditionStore.delete(diagnosticConditionEhirId);

        //Query after deletion
        var deletedFhirResource = await TestLoader.DiagnosticConditionStore.getById(diagnosticConditionEhirId);

        //Assertions
        expect(deletedFhirResource).toBeFalsy();

    });
});
