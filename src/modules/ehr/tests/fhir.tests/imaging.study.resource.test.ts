import { TestLoader } from "../test.loader";
import { ImagingStudyMapper } from "../test.data.mapper/imaging.study.ehr.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { DoctorMapper } from "../test.data.mapper/doctor.ehr.mapper";

describe('Observation resource: Storage, retrieval', () => {
    it('Given imaging study domain model, store observation resource to fhir interface, then returned imaging study details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var doctorModel = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorEhrId = await TestLoader.DoctorStore.create(doctorModel);
        
        var model = ImagingStudyMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;

        var imagingStudyEhirId = await TestLoader.ImagingStudyStore.create(model);
        var imagingStudyFhirResource = await TestLoader.ImagingStudyStore.getById(imagingStudyEhirId);

        //Assertions

        var extractedPatientEhrId = imagingStudyFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedBodySite = imagingStudyFhirResource.series[0].bodySite.display;
        expect(extractedBodySite).toEqual(model.BodySite);

        // For now just check if Visit Id exists
        var extractedVisitId = imagingStudyFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });
});
