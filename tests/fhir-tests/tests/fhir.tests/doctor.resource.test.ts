import { TestLoader } from "../test.loader";
import { DoctorMapper } from '../test.data.mapper/doctor.ehr.mapper';

//import { Logger } from "../../../../common/logger";

////////////////////////////////////////////////////////////////////////

describe('Doctor resource: Storage, retrieval', () => {
    it('Given doctor domain model, store resource to fhir interface, then returned doctor details are valid.', async () => {

        var model = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorFhirId = await TestLoader.DoctorStore.create(model);
        var doctorFhirResource = await TestLoader.DoctorStore.getById(doctorFhirId);

        //Assertions
        var extractedName = doctorFhirResource.name[0].family;
        expect(extractedName).toEqual(model.User.Person.LastName);

        var extractedBirthdate = doctorFhirResource.birthDate;
        expect(extractedBirthdate).toEqual((model.User.Person.BirthDate));

        var extractedGender = doctorFhirResource.gender;
        expect(extractedGender).toEqual((model.User.Person.Gender.toLowerCase()));

        var phoneElement = doctorFhirResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual((model.User.Person.Phone));

        var emailElement = doctorFhirResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.User.Person.Email.toLowerCase());
    });

    it('Update doctor resource, then updated doctor details are returned.', async () => {

        var model = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorFhirId = await TestLoader.DoctorStore.create(model);

        var expectedBirthDate = '1999-01-03';
        model.User.Person.BirthDate = new Date(expectedBirthDate);
        model.User.Person.FirstName = "Ajinkya";
        model.User.Person.LastName = "Mhetre";
        model.User.Person.Email = "Ajinkya.Mhetre@microsoft.com";

        var updatedResource = await TestLoader.DoctorStore.update(doctorFhirId, model);

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

    it('Delete doctor resource, then empty resource is returned for next query.', async () => {

        var model = DoctorMapper.convertJsonObjectToDomainModel();
        var doctorFhirId = await TestLoader.DoctorStore.create(model);
        var doctorFhirResource = await TestLoader.DoctorStore.getById(doctorFhirId);

        //Before deletetion
        expect(doctorFhirResource).toBeTruthy();

        //Delete
        await TestLoader.DoctorStore.delete(doctorFhirId);

        //Query after deletion
        var deletedDoctorFhirResource = await TestLoader.DoctorStore.getById(doctorFhirId);

        //Assertions
        expect(deletedDoctorFhirResource).toBeFalsy();

    });

});
