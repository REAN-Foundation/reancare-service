import { TestLoader } from "../test.loader";
import { LabVisitMapper } from "../test.data.mapper/lab.visit.ehr.mapper";

////////////////////////////////////////////////////////////////////////

describe('Lab visit resource: Storage, retrieval', () => {
    it('Given Lab visit domain model, store resource to fhir interface, then returned patient details are valid.', async () => {

        var model = LabVisitMapper.convertJsonObjectToDomainModel();
        var labVisitFhirId = await TestLoader.LabVisitStore.create(model);
        var labVisitFhirResource = await TestLoader.LabVisitStore.getById(labVisitFhirId);

        //Assertions
        var extractedName = labVisitFhirResource.status;
        expect(extractedName).toEqual(model.CurrentState);

        var extractedPatientEhrId = labVisitFhirResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedLabId = labVisitFhirResource.serviceProvider.id;
        expect(extractedLabId).toEqual(model.SuggestedLabId);

        var extractedCreatedByEhrId = labVisitFhirResource.participant[0].individual.id;
        expect(extractedCreatedByEhrId).toEqual(model.CreatedBy);

        var extractedDisplayId = labVisitFhirResource.identifier[0].value;
        expect(extractedDisplayId).toEqual(model.DisplayId);

    });

    it('Update lab visit resource, then updated patient details are returned.', async () => {

        var model = LabVisitMapper.convertJsonObjectToDomainModel();
        var labVisitFhirId = await TestLoader.LabVisitStore.create(model);

        model.CurrentState = "in-progress",
        model.DisplayId = "Encounter_Role_Test";
        model.SuggestedLabId = "4e7d4175-cdef-412b-ac26-be3c57eb822d";
        model.CreatedBy = "bcefa9d0-25b5-4748-8629-89f5ad5dbc88";

        var updatedResource = await TestLoader.LabVisitStore.update(labVisitFhirId, model);

        //Assertions
        var extractedName = updatedResource.status;
        expect(extractedName).toEqual(model.CurrentState);

        var extractedPatientEhrId = updatedResource.subject.reference.split('/')[1];
        expect(extractedPatientEhrId).toEqual(model.EhrId);

        var extractedLabId = updatedResource.serviceProvider.id;
        expect(extractedLabId).toEqual(model.SuggestedLabId);

        var extractedCreatedByEhrId = updatedResource.participant[0].individual.id;
        expect(extractedCreatedByEhrId).toEqual(model.CreatedBy);

        var extractedDisplayId = updatedResource.identifier[0].value;
        expect(extractedDisplayId).toEqual(model.DisplayId);

    });

    it('Delete lab visit resource, then empty resource is returned for next query.', async () => {

        var model = LabVisitMapper.convertJsonObjectToDomainModel();
        var labVisitFhirId = await TestLoader.LabVisitStore.create(model);
        var labVisitFhirResource = await TestLoader.LabVisitStore.getById(labVisitFhirId);

        //Before deletetion
        expect(labVisitFhirResource).toBeTruthy();

        //Delete
        await TestLoader.LabVisitStore.delete(labVisitFhirId);

        //Query after deletion
        var deletedLabVisitFhirResource = await TestLoader.LabVisitStore.getById(labVisitFhirId);

        //Assertions
        expect(deletedLabVisitFhirResource).toBeFalsy();

    });

});
