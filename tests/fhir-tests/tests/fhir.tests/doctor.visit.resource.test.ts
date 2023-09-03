import { Helper } from "../../../../common/helper";
import { TestLoader } from "../test.loader";
import { DoctorVisitMapper } from "../test.data.mapper/doctor.visit.ehr.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";
import { Logger } from "../../../../common/logger";

describe('Encounter resource: Storage, retrieval', () => {
    it('Given doctor visit domain model, store doctor visit resource to fhir interface, then returned doctor visit details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);

        var model = DoctorVisitMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.RecordedByUserId = doctorEhrId;
        
        var doctorVisitEhirId = await TestLoader.DoctorVisitStore.create(model);
        var doctorVisitFhirResource = await TestLoader.DoctorVisitStore.getById(doctorVisitEhirId);

        //Assertions

        var extractedPatientEhrId = doctorVisitFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedStartDate = doctorVisitFhirResource.period.start;
        expect(extractedStartDate).toEqual(Helper.formatDate(model.StartDate));

        var extractedEndDate = doctorVisitFhirResource.period.end;
        expect(extractedEndDate).toEqual(Helper.formatDate(model.EndDate));

        var extractedRecordedByEhrId = doctorVisitFhirResource.participant[0].individual.reference.split('/')[1];
        expect(extractedRecordedByEhrId).toEqual(model.RecordedByUserId);

        /*var extractedAppointmentId = doctorVisitFhirResource.appointment[0].id;
        expect(extractedAppointmentId).toEqual(model.AppointmentId);*/

        // For now just check if Visit Id exists
        var extractedVisitId = doctorVisitFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update doctor visit resource, then updated doctor visit details are returned.', async () => {

        var model = DoctorVisitMapper.convertJsonObjectToDomainModel();
        var doctorVisitEhirId = await TestLoader.DoctorVisitStore.create(model);

        var expectedStartDate = '2022-03-28';
        model.StartDate = new Date(expectedStartDate);

        var expectedEndDate = '2022-03-28';
        model.EndDate = new Date(expectedEndDate);

        var updatedResource = await TestLoader.DoctorVisitStore.update(doctorVisitEhirId, model);

        var str = JSON.stringify(updatedResource, null, 2);
        Logger.instance().log(str);

        //Assertions
        var extractedStartDate = updatedResource.period.start;
        expect(extractedStartDate).toEqual(Helper.formatDate(model.StartDate));

        var extractedEndDate = updatedResource.period.end;
        expect(extractedEndDate).toEqual(Helper.formatDate(model.EndDate));

    });

    it('Delete doctor visit resource, then empty resource is returned for next query.', async () => {

        var model = DoctorVisitMapper.convertJsonObjectToDomainModel();
        var doctorVisitEhirId = await TestLoader.DoctorVisitStore.create(model);
        var doctorVisitFhirResource = await TestLoader.DoctorVisitStore.getById(doctorVisitEhirId);

        //Before deletetion
        expect(doctorVisitFhirResource).toBeTruthy();

        //Delete
        await TestLoader.DoctorVisitStore.delete(doctorVisitEhirId);

        //Query after deletion
        var deletedDoctorVisitFhirResource = await TestLoader.DoctorVisitStore.getById(doctorVisitEhirId);

        //Assertions
        expect(deletedDoctorVisitFhirResource).toBeFalsy();

    });
});
