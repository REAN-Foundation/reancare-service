import { Helper } from "../../../../common/helper";
import { TestLoader } from "../test.loader";
import { DoctorVisitMapper } from "../test.data.mapper/doctor.visit.ehr.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";

describe('Observation resource: Storage, retrieval', () => {
    it('Given doctor visit domain model, store observation resource to fhir interface, then returned doctor visit details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);

        var model = DoctorVisitMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;
        model.DoctorEhrId = doctorEhrId;

        var doctorVisitEhirId = await TestLoader.DoctorVisitStore.create(model);
        var doctorVisitFhirResource = await TestLoader.DoctorVisitStore.getById(doctorVisitEhirId);

        //Assertions

        var extractedPatientEhrId = doctorVisitFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedStartDate = doctorVisitFhirResource.period.start;
        expect(extractedStartDate).toEqual(Helper.formatDate(model.StartDate));

        var extractedEndDate = doctorVisitFhirResource.period.end;
        expect(extractedEndDate).toEqual(Helper.formatDate(model.EndDate));

        var extractedDoctorEhrId = doctorVisitFhirResource.participant[0].individual.reference.split('/')[1];
        expect(extractedDoctorEhrId).toEqual(model.DoctorEhrId);

        /*var extractedAppointmentId = doctorVisitFhirResource.appointment[0].id;
        expect(extractedAppointmentId).toEqual(model.AppointmentId);*/

        // For now just check if Visit Id exists
        var extractedVisitId = doctorVisitFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });
});
