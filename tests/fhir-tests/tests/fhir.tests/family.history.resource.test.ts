import { TestLoader } from "../test.loader";
import { FamilyHistoryMapper } from "../test.data.mapper/family.history.ehr.mapper";
import { Helper } from "../../../../common/helper";

describe('family history resource: Storage, retrieval', () => {
    it('Given family history domain model, store family history resource to fhir interface, then returned family history details are valid.', async () => {

        var model = FamilyHistoryMapper.convertJsonObjectToDomainModel();
        
        var familyHistoryEhrId = await TestLoader.FamilyHistoryStore.create(model);
        var familyHistoryFhirResource = await TestLoader.FamilyHistoryStore.getById(familyHistoryEhrId);

        // Assertions
        var extractedPatientEhrId = familyHistoryFhirResource.patient.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedRelationship = familyHistoryFhirResource.relationship.coding[0].display;
        expect(extractedRelationship).toEqual(model.Relationship);

        var extractedCondition = familyHistoryFhirResource.condition[0].code.coding[0].display;
        expect(extractedCondition).toEqual(model.Condition);

        var extractedStatus = familyHistoryFhirResource.status;
        expect(extractedStatus).toEqual(model.Status);

        var extractedDate = familyHistoryFhirResource.date;
        expect(extractedDate).toEqual(Helper.formatDate(model.Date));

    });

    it('Update family history resource, then updated family history details are returned.', async () => {

        var model = FamilyHistoryMapper.convertJsonObjectToDomainModel();
        var biometricsHeightEhirId = await TestLoader.FamilyHistoryStore.create(model);

        var expectedRecordDate = '2022-03-03';
        model.Date = new Date(expectedRecordDate);
        model.Condition = "High Blood Pressure";
        model.Status = "completed";
        model.Relationship = "Father";

        var updatedResource = await TestLoader.FamilyHistoryStore.update(biometricsHeightEhirId, model);

        //Assertions
        var extractedRelationship = updatedResource.relationship.coding[0].display;
        expect(extractedRelationship).toEqual(model.Relationship);

        var extractedCondition = updatedResource.condition[0].code.coding[0].display;
        expect(extractedCondition).toEqual(model.Condition);

        var extractedstatus = updatedResource.status;
        expect(extractedstatus).toEqual(model.Status);

        var extractedRecordDate = updatedResource.date;
        expect(extractedRecordDate).toEqual(Helper.formatDate(model.Date));
    });

    it('Delete family history resource, then empty resource is returned for next query.', async () => {

        var model = FamilyHistoryMapper.convertJsonObjectToDomainModel();
        var familyHistoryEhirId = await TestLoader.FamilyHistoryStore.create(model);
        var familyHistoryFhirResource = await TestLoader.FamilyHistoryStore.getById(familyHistoryEhirId);

        //Before deletetion
        expect(familyHistoryFhirResource).toBeTruthy();

        //Delete
        await TestLoader.FamilyHistoryStore.delete(familyHistoryEhirId);

        //Query after deletion
        var deletedHeightFhirResource = await TestLoader.FamilyHistoryStore.getById(familyHistoryEhirId);

        //Assertions
        expect(deletedHeightFhirResource).toBeFalsy();

    });
});
