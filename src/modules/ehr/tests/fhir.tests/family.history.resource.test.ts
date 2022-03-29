import { TestLoader } from "../test.loader";
import { FamilyHistoryMapper } from "../test.data.mapper/family.history.ehr.mapper";
import { PatientMapper } from "../test.data.mapper/patient.ehr.mapper";
import { Helper } from "../../../../common/helper";

describe('familyHistory resource: Storage, retrieval', () => {
    it('Given familyHistory domain model, store familyHistory resource to fhir interface, then returned familyHistory details are valid.', async () => {

        var patientModel = PatientMapper.convertJsonObjectToDomainModel();
        var patientEhrId = await TestLoader.PatientStore.create(patientModel);

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
});
