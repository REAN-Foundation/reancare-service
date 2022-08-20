import { TestLoader } from "../test.loader";
import { ImagingStudyMapper } from "../test.data.mapper/imaging.study.ehr.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { Helper } from "../../../../common/helper";
import { Logger } from "../../../../common/logger";

describe('ImagingStudy resource: Storage, retrieval', () => {
    it('Given imaging study domain model, store imaging study resource to fhir interface, then returned imaging study details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

        var model = ImagingStudyMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;

        var imagingStudyEhirId = await TestLoader.ImagingStudyStore.create(model);
        var imagingStudyFhirResource = await TestLoader.ImagingStudyStore.getById(imagingStudyEhirId);

        //Assertions

        var extractedPatientEhrId = imagingStudyFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedBodySite = imagingStudyFhirResource.series[0].bodySite.display;
        expect(extractedBodySite).toEqual(model.BodySite);

        var extractedSeriesCount = imagingStudyFhirResource.numberOfSeries;
        expect(extractedSeriesCount).toEqual(model.SeriesCount);

        var extractedInstanceCount = imagingStudyFhirResource.numberOfInstances;
        expect(extractedInstanceCount).toEqual(model.InstanceCount);

        var extractedStudyDate = imagingStudyFhirResource.started;
        expect(extractedStudyDate).toEqual(Helper.formatDate(model.StudyDate));

        // For now just check if Visit Id exists
        var extractedVisitId = imagingStudyFhirResource.id;
        expect(extractedVisitId).toBeTruthy();

    });

    it('Update imaging study resource, then updated imaging study details are returned.', async () => {

        var model = ImagingStudyMapper.convertJsonObjectToDomainModel();
        var imagingStudyEhirId = await TestLoader.ImagingStudyStore.create(model);

        var expectedStudyDate = '2022-03-25';
        model.StudyDate = new Date(expectedStudyDate);
        model.BodySite = "Lower Trunk structure";
        model.InstanceCount = 2;
        model.SeriesCount = 2;

        var updatedResource = await TestLoader.ImagingStudyStore.update(imagingStudyEhirId, model);

        var str = JSON.stringify(updatedResource, null, 2);
        Logger.instance().log(str);

        //Assertions
        var extractedBodySite = updatedResource.series[0].bodySite.display;
        expect(extractedBodySite).toEqual(model.BodySite);

        var extractedInstanceCount = updatedResource.numberOfInstances;
        expect(extractedInstanceCount).toEqual(model.InstanceCount);

        var extractedSeriesCount = updatedResource.numberOfSeries;
        expect(extractedSeriesCount).toEqual(model.SeriesCount);

    });

    it('Delete imaging study resource, then empty resource is returned for next query.', async () => {

        var model = ImagingStudyMapper.convertJsonObjectToDomainModel();
        var imagingStudyEhirId = await TestLoader.ImagingStudyStore.create(model);
        var imagingStudyFhirResource = await TestLoader.ImagingStudyStore.getById(imagingStudyEhirId);

        //Before deletetion
        expect(imagingStudyFhirResource).toBeTruthy();

        //Delete
        await TestLoader.ImagingStudyStore.delete(imagingStudyEhirId);

        //Query after deletion
        var deletedImagingStudyFhirResource = await TestLoader.ImagingStudyStore.getById(imagingStudyEhirId);

        //Assertions
        expect(deletedImagingStudyFhirResource).toBeFalsy();

    });
});
