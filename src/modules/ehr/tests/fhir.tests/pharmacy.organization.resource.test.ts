import { TestLoader } from "../test.loader";
import { PharmacyOrganizationMapper } from "../test.data.mapper/pharmacy.organization.mapper";

describe('ClinicOrganization resource: Storage, retrieval', () => {
    it('Given ClinicOrganization domain model, store ClinicOrganization resource to fhir interface, then returned ClinicOrganization details are valid.', async () => {

        var model = PharmacyOrganizationMapper.convertJsonObjectToDomainModel();
        var pharmacyFhirId = await TestLoader.PharmacyStore.create(model);
        var pharmacyFhirResource = await TestLoader.PharmacyStore.getById(pharmacyFhirId);

        //Assertions
        var extractedName = pharmacyFhirResource.name;
        expect(extractedName).toEqual(model.Name);

        var phoneElement = pharmacyFhirResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual(model.ContactPhone);

        var emailElement = pharmacyFhirResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.ContactEmail.toLowerCase());
    });

    it('Update patient resource, then updated patient details are returned.', async () => {

        var model = PharmacyOrganizationMapper.convertJsonObjectToDomainModel();
        var patientFhirId = await TestLoader.PharmacyStore.create(model);

        model.Name = "Max Pharmacy";
        model.ContactPhone = "123456789";
        model.ContactEmail = "max@gmail.com";
        model.Type = "Pharmacy";

        var updatedResource = await TestLoader.PharmacyStore.update(patientFhirId, model);

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

    it('Delete patient resource, then empty resource is returned for next query.', async () => {

        var model = PharmacyOrganizationMapper.convertJsonObjectToDomainModel();
        var pharmacyFhirId = await TestLoader.PharmacyStore.create(model);
        var pharmacyFhirResource = await TestLoader.PharmacyStore.getById(pharmacyFhirId);

        //Before deletetion
        expect(pharmacyFhirResource).toBeTruthy();

        //Delete
        await TestLoader.PharmacyStore.delete(pharmacyFhirId);

        //Query after deletion
        var deletedPharmacyFhirResource = await TestLoader.PharmacyStore.getById(pharmacyFhirId);

        //Assertions
        expect(deletedPharmacyFhirResource).toBeFalsy();

    });

});

