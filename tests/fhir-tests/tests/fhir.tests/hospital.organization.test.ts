import { HospitalOrganizationMapper } from "../test.data.mapper/hospital.organization.mapper";
import { TestLoader } from "../test.loader";

describe('Hospital Organization resource: Storage, retrieval', () => {
    it('Given Hospital Organization domain model, store Hospital resource to fhir interface, then returned Hospital details are valid.', async () => {

        var model = HospitalOrganizationMapper.convertJsonObjectToDomainModel();
        var hospitalFhirId = await TestLoader.HospitalOrganizationStore.create(model);
        var hospitalFhirResource = await TestLoader.HospitalOrganizationStore.getById(hospitalFhirId);

        //Assertions
        var extractedName = hospitalFhirResource.name;
        expect(extractedName).toEqual(model.Name);

        var extractedstatus = hospitalFhirResource.active;
        expect(extractedstatus).toEqual(model.IsHealthFacility);

        var extractedAddId = hospitalFhirResource.address[0].id;
        expect(extractedAddId).toEqual(model.AddressIds);

        var extractedStartDate = hospitalFhirResource.address[0].period.start;
        expect(extractedStartDate).toEqual(model.OperationalSince);

        var phoneElement = hospitalFhirResource.telecom.find(function (e) {
            return e.system === 'phone';
        });
        var extractedPhone = phoneElement ? phoneElement.value : '';
        expect(extractedPhone).toEqual(model.ContactPhone);

        var emailElement = hospitalFhirResource.telecom.find(function (e) {
            return e.system === 'email';
        });
        var extractedEmail = emailElement ? emailElement.value : '';
        expect(extractedEmail.toLowerCase()).toEqual(model.ContactEmail.toLowerCase());
    });

    it('Update hospital resource, then updated hospital details are returned.', async () => {

        var model = HospitalOrganizationMapper.convertJsonObjectToDomainModel();
        var hospitalFhirId = await TestLoader.HospitalOrganizationStore.create(model);

        model.Name = "Aiims New Delhi";
        model.ContactPhone = "1231231232";
        model.ContactEmail = "aiims.hospital@gmail.com";
        model.AddressIds = ["555c791d-618e-4090-8fcf-a1299624a194"];
        model.IsHealthFacility = false;

        var updatedResource = await TestLoader.HospitalOrganizationStore.update(hospitalFhirId, model);

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

    it('Delete hospital resource, then empty resource is returned for next query.', async () => {

        var model = HospitalOrganizationMapper.convertJsonObjectToDomainModel();
        var hospitalFhirId = await TestLoader.HospitalOrganizationStore.create(model);
        var hospitalFhirResource = await TestLoader.HospitalOrganizationStore.getById(hospitalFhirId);

        //Before deletetion
        expect(hospitalFhirResource).toBeTruthy();

        //Delete
        await TestLoader.HospitalOrganizationStore.delete(hospitalFhirId);

        //Query after deletion
        var deletedHospitalFhirResource = await TestLoader.HospitalOrganizationStore.getById(hospitalFhirId);

        //Assertions
        expect(deletedHospitalFhirResource).toBeFalsy();

    });
});
