import { TestLoader } from "../test.loader";
import { DiagnosticLabUserMapper } from "../test.data.mapper/diagnostic.lab.user.mapper";

describe('diagnostic lab user resource: Storage, retrieval', () => {
    it('Given diagnosticlabuser domain model, store diagnosticlabuser resource to fhir interface, then returned diagnosticlabuser details are valid.', async () => {

        var model = DiagnosticLabUserMapper.convertJsonObjectToDomainModel();
        var DiagnosticLabUserFhirId = await TestLoader.DiagnosticLabUserStore.create(model);
        var DiagnosticLabUserFhirResource = await TestLoader.DiagnosticLabUserStore.getById(DiagnosticLabUserFhirId);

        //Assertions
        var extractedName = DiagnosticLabUserFhirResource.name[0].family;
        expect(extractedName).toEqual(model.LastName);

        var extractedBirthdate = DiagnosticLabUserFhirResource.birthDate;
        expect(extractedBirthdate).toEqual(model.BirthDate);

        var extractedGender = DiagnosticLabUserFhirResource.gender;
        expect(extractedGender).toEqual(model.Gender.toLowerCase());

        var phoneElement = DiagnosticLabUserFhirResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual(model.Phone);

        var emailElement = DiagnosticLabUserFhirResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.Email.toLowerCase());
    });

    it('Update diagnostic lab user resource, then updated patient details are returned.', async () => {

        var model = DiagnosticLabUserMapper.convertJsonObjectToDomainModel();
        var diagnosticLabUserFhirId = await TestLoader.DiagnosticLabUserStore.create(model);

        var expectedBirthDate = '1998-07-04';
        model.BirthDate = new Date(expectedBirthDate);
        model.FirstName = "Rahul";
        model.LastName = "Shinde";
        model.Email = "Rahul.Shinde@microsoft.com";

        var updatedResource = await TestLoader.DiagnosticLabUserStore.update(diagnosticLabUserFhirId, model);

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

    it('Delete diagnostic lab user resource, then empty resource is returned for next query.', async () => {

        var model = DiagnosticLabUserMapper.convertJsonObjectToDomainModel();
        var diagnosticLabUserFhirId = await TestLoader.DiagnosticLabUserStore.create(model);
        var diagnosticLabUserFhirResource = await TestLoader.DiagnosticLabUserStore.getById(diagnosticLabUserFhirId);

        //Before deletetion
        expect(diagnosticLabUserFhirResource).toBeTruthy();

        //Delete
        await TestLoader.DiagnosticLabUserStore.delete(diagnosticLabUserFhirId);

        //Query after deletion
        var deletedDiagnosticLabFhirResource = await TestLoader.DiagnosticLabUserStore.getById(diagnosticLabUserFhirId);

        //Assertions
        expect(deletedDiagnosticLabFhirResource).toBeFalsy();

    });
});
