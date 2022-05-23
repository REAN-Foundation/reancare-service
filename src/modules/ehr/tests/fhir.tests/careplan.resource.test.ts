import { TestLoader } from "../test.loader";
import { CarePlanMapper } from "../test.data.mapper/careplan.ehr.mapper";

describe('Care plan resource: Storage, retrieval', () => {
    it('Given care plan domain model, store observation resource to fhir interface, then returned care plan details are valid.', async () => {

        var model = CarePlanMapper.convertJsonObjectToDomainModel();
        
        var carePlanEhirId = await TestLoader.CarePlanStore.add(model);
        var carePlanResource = await TestLoader.CarePlanStore.getById(carePlanEhirId);

        //Assertions

        var extractedProvider = carePlanResource.author.display;
        expect(extractedProvider).toEqual(model.Provider);

        var extractedTitle = carePlanResource.title;
        expect(extractedTitle).toEqual(model.PlanName);

        var extractedStartTime = carePlanResource.period.start;
        expect(extractedStartTime).toEqual(model.StartDate);

        var extractedPatientEhrId = carePlanResource.subject.id;
        expect(extractedPatientEhrId).toEqual(model.PatientUserId);

        var extractedPatientName = carePlanResource.subject.display;
        expect(extractedPatientName).toEqual(model.Name);
 
        var extractedCarePlanId = carePlanResource.id;
        expect(extractedCarePlanId).toBeTruthy();

    });

    it('Update care plan resource, then updated care plan details are returned.', async () => {

        var model = CarePlanMapper.convertJsonObjectToDomainModel();
        var carePlanFhirId = await TestLoader.CarePlanStore.add(model);

        var expectedStartDate = '2022-01-05T00:00:00.000Z';
        var expectedEndDate = '2022-01-21T00:00:00.000Z';
        model.StartDate = new Date(expectedStartDate);
        model.EndDate = new Date(expectedEndDate);
        model.PlanName = "Weight loss care plan";
        model.Provider = "WHO";

        var updatedResource = await TestLoader.CarePlanStore.update(carePlanFhirId, model);

        var extractedProvider = updatedResource.author.display;
        expect(extractedProvider).toEqual(model.Provider);

        var extractedTitle = updatedResource.title;
        expect(extractedTitle).toEqual(model.PlanName);

        var extractedStartTime = updatedResource.period.start;
        expect(extractedStartTime).toEqual(expectedStartDate);

        var extractedPatientName = updatedResource.subject.display;
        expect(extractedPatientName).toEqual(model.Name);

        var extractedEndTime = updatedResource.period.end;
        expect(extractedEndTime).toEqual(expectedEndDate);
        
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
