import { ClinicOrganizationMapper } from "../test.data.mapper/clinic.organization.mapper";
import { TestLoader } from "../test.loader";

describe('Clinical Organization resource: Storage, retrieval', () => {
    it('Given Clinical Organization domain model, store Clinical resource to fhir interface, then returned Clinical details are valid.', async () => {

        var model = ClinicOrganizationMapper.convertJsonObjectToDomainModel();
        var clinicOrgFhirId = await TestLoader.ClinicOrganizationStore.create(model);
        var clinicOrgFhirResource = await TestLoader.ClinicOrganizationStore.getById(clinicOrgFhirId);

        //Assertions
        var extractedName = clinicOrgFhirResource.name;
        expect(extractedName).toEqual(model.Name);

        var extractedstatus = clinicOrgFhirResource.active;
        expect(extractedstatus).toEqual(model.IsHealthFacility);

        var extractedAddId = clinicOrgFhirResource.address[0].id;
        expect(extractedAddId).toEqual(model.AddressIds);

        var extractedStartDate = clinicOrgFhirResource.address[0].period.start;
        expect(extractedStartDate).toEqual(model.OperationalSince);

        var phoneElement = clinicOrgFhirResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual(model.ContactPhone);

        var emailElement = clinicOrgFhirResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.ContactEmail.toLowerCase());
    });

    it('Update clinical resource, then updated clinical details are returned.', async () => {

        var model = ClinicOrganizationMapper.convertJsonObjectToDomainModel();
        var clinicOrgFhirId = await TestLoader.ClinicOrganizationStore.create(model);

        model.Name = "MedPace clinic";
        model.ContactPhone = "1231231232";
        model.ContactEmail = "medpace.clinic@gmail.com";
        model.AddressIds = ["555c791d-618e-4090-8fcf-a1299624a194"];
        model.IsHealthFacility = false;

        var updatedResource = await TestLoader.ClinicOrganizationStore.update(clinicOrgFhirId, model);

        var extractedName = updatedResource.name;
        expect(extractedName).toEqual(model.Name);

        var extractedstatus = updatedResource.active;
        expect(extractedstatus).toEqual(model.IsHealthFacility);

        var extractedAddId = updatedResource.address[0].id;
        expect(extractedAddId).toEqual(model.AddressIds[0]);

        var extractedStartDate = updatedResource.address[0].period.start;
        expect(extractedStartDate).toEqual(model.OperationalSince);

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

    it('Delete clinical resource, then empty resource is returned for next query.', async () => {

        var model = ClinicOrganizationMapper.convertJsonObjectToDomainModel();
        var clinicOrgFhirId = await TestLoader.ClinicOrganizationStore.create(model);
        var clinicOrgFhirResource = await TestLoader.ClinicOrganizationStore.getById(clinicOrgFhirId);

        //Before deletetion
        expect(clinicOrgFhirResource).toBeTruthy();

        //Delete
        await TestLoader.ClinicOrganizationStore.delete(clinicOrgFhirId);

        //Query after deletion
        var deletedClinicalFhirResource = await TestLoader.ClinicOrganizationStore.getById(clinicOrgFhirId);

        //Assertions
        expect(deletedClinicalFhirResource).toBeFalsy();

    });
});
