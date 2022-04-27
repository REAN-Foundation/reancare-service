import { TestLoader } from "../test.loader";
import { LabOrganizationMapper } from "../test.data.mapper/lab.organization.mapper";
//import { PhoneNumberContext } from "twilio/lib/rest/lookups/v1/phoneNumber";

describe('LabOrganization resource: Storage, retrieval', () => {
    it('Given LabOrganization domain model, store LabOrganization resource to fhir interface, then returned LabOrganization details are valid.', async () => {

        var model = LabOrganizationMapper.convertJsonObjectToDomainModel();
        var labOrganizationFhirId = await TestLoader.LabOrganizationStore.create(model);
        var labOrganizationFhirResource = await TestLoader.LabOrganizationStore.getById(labOrganizationFhirId);

        //Assertions
        var extractedName = labOrganizationFhirResource.name;
        expect(extractedName).toEqual(model.Name);

        var phoneElement = labOrganizationFhirResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual(model.ContactPhone);

        var emailElement = labOrganizationFhirResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.ContactEmail.toLowerCase());
    });

    it('Update lab organization resource, then updated patient details are returned.', async () => {

        var model = LabOrganizationMapper.convertJsonObjectToDomainModel();
        var labOrganizationFhirId = await TestLoader.LabOrganizationStore.create(model);

        model.ContactPhone = '7083456276';
        model.Name = "Amit";
        model.ContactEmail = "Amit@microsoft.com";

        var updatedResource = await TestLoader.LabOrganizationStore.update(labOrganizationFhirId, model);

        // const str = JSON.stringify(updatedResource, null, 2);
        // Logger.instance().log(str);

        //Assertions

        var extractedName = updatedResource.name;
        expect(extractedName).toEqual(model.Name);

        var phoneElement = updatedResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual(model.ContactPhone);

        var emailElement = updatedResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.ContactEmail.toLowerCase());
       
    });

    it('Delete lab organization resource, then empty resource is returned for next query.', async () => {

        var model = LabOrganizationMapper.convertJsonObjectToDomainModel();
        var labOrganizationFhirId = await TestLoader.LabOrganizationStore.create(model);
        var LabOrganizationFhirResource = await TestLoader.LabOrganizationStore.getById(labOrganizationFhirId);

        //Before deletetion
        expect(LabOrganizationFhirResource).toBeTruthy();

        //Delete
        await TestLoader.LabOrganizationStore.delete(labOrganizationFhirId);

        //Query after deletion
        // eslint-disable-next-line max-len
        var deletedLabOrganizationFhirResource = await TestLoader.LabOrganizationStore.getById(labOrganizationFhirId);

        //Assertions
        expect(deletedLabOrganizationFhirResource).toBeFalsy();

    });
});
