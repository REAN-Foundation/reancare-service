import { TestLoader } from "../test.loader";
import { PharmacistMapper } from "../test.data.mapper/pharmacist.mapper";

describe('Pharmacist resource: Storage, retrieval', () => {
    it('Given pharmacist domain model, store pharmacist resource to fhir interface, then returned pharmacist details are valid.', async () => {

        var model = PharmacistMapper.convertJsonObjectToDomainModel();
        var PharmacistFhirId = await TestLoader.PharmacistStore.add(model);
        var PharmacistFhirResource = await TestLoader.PharmacistStore.getById(PharmacistFhirId);

        //Assertions
        var extractedName = PharmacistFhirResource.name[0].family;
        expect(extractedName).toEqual(model.LastName);

        var extractedBirthdate = PharmacistFhirResource.birthDate;
        expect(extractedBirthdate).toEqual(model.BirthDate);

        var extractedGender = PharmacistFhirResource.gender;
        expect(extractedGender).toEqual(model.Gender.toLowerCase());

        var phoneElement = PharmacistFhirResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual(model.Phone);

        var emailElement = PharmacistFhirResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.Email.toLowerCase());
    });

    it('Update pharmacist resource, then updated patient details are returned.', async () => {

        var model = PharmacistMapper.convertJsonObjectToDomainModel();
        var pharmacistFhirId = await TestLoader.PharmacistStore.add(model);

        var expectedBirthDate = '1999-01-03';
        model.BirthDate = new Date(expectedBirthDate);
        model.FirstName = "Ajinkya";
        model.LastName = "Mhetre";
        model.Email = "Ajinkya.Mhetre@microsoft.com";

        var updatedResource = await TestLoader.PharmacistStore.update(pharmacistFhirId, model);

        // const str = JSON.stringify(updatedResource, null, 2);
        // Logger.instance().log(str);

        //Assertions
        var extractedFirstName = updatedResource.name[0].given[0];
        expect(extractedFirstName).toEqual(model.FirstName);

        var extractedLastName = updatedResource.name[0].family;
        expect(extractedLastName).toEqual(model.LastName);

        var extractedBirthdate = updatedResource.birthDate;
        expect(extractedBirthdate).toEqual(expectedBirthDate);

        var emailElement = updatedResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.Email.toLowerCase());
    });

    it('Delete pharmacist resource, then empty resource is returned for next query.', async () => {

        var model = PharmacistMapper.convertJsonObjectToDomainModel();
        var pharmacistFhirId = await TestLoader.PharmacistStore.add(model);
        var pharmacistFhirResource = await TestLoader.PharmacistStore.getById(pharmacistFhirId);

        //Before deletetion
        expect(pharmacistFhirResource).toBeTruthy();

        //Delete
        await TestLoader.PharmacistStore.delete(pharmacistFhirId);

        //Query after deletion
        var deletedPharmacistFhirResource = await TestLoader.PatientStore.getById(pharmacistFhirId);

        //Assertions
        expect(deletedPharmacistFhirResource).toBeFalsy();

    });
});
