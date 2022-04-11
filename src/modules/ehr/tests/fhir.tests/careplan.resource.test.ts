import { TestLoader } from "../test.loader";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { CarePlanMapper } from "../test.data.mapper/careplan.ehr.mapper";

describe('Care plan resource: Storage, retrieval', () => {
    it('Given care plan domain model, store observation resource to fhir interface, then returned care plan details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);
    
        var model = CarePlanMapper.convertJsonObjectToDomainModel();
        model.EhrId = patientEhrId;

        var carePlanEhirId = await TestLoader.CarePlanStore.add(model);
        var carePlanResource = await TestLoader.CarePlanStore.getById(carePlanEhirId);

        //Assertions

        var extractedTitle = carePlanResource.title;
        expect(extractedTitle).toEqual(model.Title);

        var extractedProvider = carePlanResource.author.display;
        expect(extractedProvider).toEqual(model.Provider);

        var extractedCategory = carePlanResource.category[0].text;
        expect(extractedCategory).toEqual(model.Category);

        var extractedStartTime = carePlanResource.period.start;
        expect(extractedStartTime).toEqual(model.ScheduledAt);

        var extractedStatus = carePlanResource.status;
        expect(extractedStatus).toEqual(model.Status);

        var extractedPlanName = carePlanResource.activity[0].reference.display;
        expect(extractedPlanName).toEqual(model.PlanName);

        var extractedPlanCode = carePlanResource.activity[0].reference.id;
        expect(extractedPlanCode).toEqual(model.PlanCode);

        var extractedPatientEhrId = carePlanResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.PatientUserId);

        var extractedParticipantId = carePlanResource.subject.id;
        expect(extractedParticipantId).toEqual(model.ParticipantId);
 
        var extractedCarePlanId = carePlanResource.id;
        expect(extractedCarePlanId).toBeTruthy();

    });

    it('Update care plan resource, then updated care plan details are returned.', async () => {

        var model = CarePlanMapper.convertJsonObjectToDomainModel();
        var carePlanFhirId = await TestLoader.CarePlanStore.add(model);

        var expectedStartDate = '2022-01-03T00:00:00.000Z';
        model.PlanName = "Weight loss";
        model.PlanCode = "WL";
        model.ScheduledAt = new Date(expectedStartDate);
        model.Status = "completed";
        model.Title = "Weight loss care plan";

        var updatedResource = await TestLoader.CarePlanStore.update(carePlanFhirId, model);

        var extractedTitle = updatedResource.title;
        expect(extractedTitle).toEqual(model.Title);

        var extractedStartTime = updatedResource.period.start;
        expect(extractedStartTime).toEqual(expectedStartDate);

        var extractedStatus = updatedResource.status;
        expect(extractedStatus).toEqual(model.Status);

        var extractedPlanName = updatedResource.activity[0].reference.display;
        expect(extractedPlanName).toEqual(model.PlanName);

        var extractedPlanCode = updatedResource.activity[0].reference.id;
        expect(extractedPlanCode).toEqual(model.PlanCode);

        var extractedPatientEhrId = updatedResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.PatientUserId);

        var extractedCarePlanId = updatedResource.id;
        expect(extractedCarePlanId).toBeTruthy();
    });

    it('Delete care plan resource, then empty resource is returned for next query.', async () => {

        var model = CarePlanMapper.convertJsonObjectToDomainModel();
        var carePlanFhirId = await TestLoader.CarePlanStore.add(model);
        var carePlanFhirResource = await TestLoader.CarePlanStore.getById(carePlanFhirId);

        //Before deletetion
        expect(carePlanFhirResource).toBeTruthy();

        //Delete
        await TestLoader.CarePlanStore.delete(carePlanFhirId);

        //Query after deletion
        var deletedCarePlanFhirResource = await TestLoader.CarePlanStore.getById(carePlanFhirId);

        //Assertions
        expect(deletedCarePlanFhirResource).toBeFalsy();

    });
});
