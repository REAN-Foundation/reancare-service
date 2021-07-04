import { Loader } from "../startup/loader";



// describe('Patient resource: Storage, retrieval', () => {
//     it('Given patient domain model, store patient resource to fhir interface, then returned patient details are valid.', async () => {

//         var model = PatientMapper.convertJsonObjectToDomainModel();
//         var patientFhirId = await Loader.PatientStore.create(model);
//         var patientFhirResource = await Loader.PatientStore.getById(patientFhirId);

//         //Assertions
//         var extractedName = patientFhirResource.name[0].family;
//         expect(extractedName).toEqual(model.LastName);

//         var extractedBirthdate = patientFhirResource.birthDate;
//         expect(extractedBirthdate).toEqual(model.BirthDate);

//         var extractedGender = patientFhirResource.gender;
//         expect(extractedGender).toEqual(model.Gender.toLowerCase());

//         var phoneElement = patientFhirResource.telecom.find(function (e) {
//             return e.system === 'phone';
//         });
//         var extractedPhone = phoneElement ? phoneElement.value : '';
//         expect(extractedPhone).toEqual(model.Phone);

//         var emailElement = patientFhirResource.telecom.find(function (e) {
//             return e.system === 'email';
//         });
//         var extractedEmail = emailElement ? emailElement.value : '';
//         expect(extractedEmail.toLowerCase()).toEqual(model.Email.toLowerCase());
//     });
// });
