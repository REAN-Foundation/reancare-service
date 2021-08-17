import { TestLoader } from "../test.loader";
import { PatientMapper } from '../test.data.mapper/patient.ehr.mapper';

//import { Logger } from "../../../../common/logger";

////////////////////////////////////////////////////////////////////////

describe('Patient resource: Storage, retrieval', () => {
    it('Given patient domain model, store resource to fhir interface, then returned patient details are valid.', async () => {

        var model = PatientMapper.convertJsonObjectToDomainModel();
        var patientFhirId = await TestLoader.PatientStore.create(model);
        var patientFhirResource = await TestLoader.PatientStore.getById(patientFhirId);

        //Assertions
        var extractedName = patientFhirResource.name[0].family;
        expect(extractedName).toEqual(model.User.Person.LastName);

        var extractedBirthdate = patientFhirResource.birthDate;
        expect(extractedBirthdate).toEqual((model.User.Person.BirthDate));

        var extractedGender = patientFhirResource.gender;
        expect(extractedGender).toEqual((model.User.Person.Gender.toLowerCase()));

        var phoneElement = patientFhirResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual((model.User.Person.Phone));

        var emailElement = patientFhirResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.User.Person.Email.toLowerCase());
    });

    it('Update patient resource, then updated patient details are returned.', async () => {

        var model = PatientMapper.convertJsonObjectToDomainModel();
        var patientFhirId = await TestLoader.PatientStore.create(model);

        var expectedBirthDate = '1999-01-03';
        model.User.Person.BirthDate = new Date(expectedBirthDate);
        model.User.Person.FirstName = "Ajinkya";
        model.User.Person.LastName = "Mhetre";
        model.User.Person.Email = "Ajinkya.Mhetre@microsoft.com";

        var updatedResource = await TestLoader.PatientStore.update(patientFhirId, model);

        // const str = JSON.stringify(updatedResource, null, 2);
        // Logger.instance().log(str);

        //Assertions
        var extractedFirstName = updatedResource.name[0].given[0];
        expect(extractedFirstName).toEqual(model.User.Person.FirstName);

        var extractedLastName = updatedResource.name[0].family;
        expect(extractedLastName).toEqual(model.User.Person.LastName);

        var extractedBirthdate = updatedResource.birthDate;
        expect(extractedBirthdate).toEqual(expectedBirthDate);

        var emailElement = updatedResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.User.Person.Email.toLowerCase());
    });

    it('Delete patient resource, then empty resource is returned for next query.', async () => {

        var model = PatientMapper.convertJsonObjectToDomainModel();
        var patientFhirId = await TestLoader.PatientStore.create(model);
        var patientFhirResource = await TestLoader.PatientStore.getById(patientFhirId);

        //Before deletetion
        expect(patientFhirResource).toBeTruthy();

        //Delete
        await TestLoader.PatientStore.delete(patientFhirId);

        //Query after deletion
        var deletedPatientFhirResource = await TestLoader.PatientStore.getById(patientFhirId);

        //Assertions
        expect(deletedPatientFhirResource).toBeFalsy();

    });

});
