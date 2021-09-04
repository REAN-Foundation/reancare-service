## General checklist to add new API/feature/model

While adding or updating a feature/model, please check that following artefacts are implemented/updated.

It is recommended that you follow these in sequence starting with writing the tests. This will help you to make sure your implementation follows TDD and does not deviate too much from the requirements.

 Since we use [Postman/Newman](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/) for our API testing, we need to start with writing Postman requests and tests for the API. Having API tests in Postman also helps us in maintaining tests, API documentation, workflow mocking at the same place.

Here is the itemized checklist you should use whenever you are adding a new API, new entity model with CRUD API or updating the existing ones.

 - [ ]  **Postman requests**
   - [ ]  Add requests to the Postman collection with all input parameters.
   - [ ]  Add environment variables to support requests.
   - [ ]  Add Pre-request-scripts to generate request input data if necessary.
   - [ ]  Add request tests to test the output reponse of the request.
 - [ ]  **Routes**
   - [ ]  Create `<api/entity>.routes.ts` file in `/src/api/routes` folder. Please make sure the routes added here match the ones in Postman collection.
   - [ ]  Add client and user authentication middleware calls as per the requirement of the routes.
   - [ ]  Add an entry of the routes in `/src/api/routes/router.ts` file.
 - [ ]  **Domain Types**
   - [ ]  Add interface definitions for your domain models in file `/src/domain.types/<api/entity>/<api.entity>.domain.model.ts`.
   - [ ]  Add DTOs in file `/src/domain.types/<api/entity>/<api.entity>.dto.ts`.
   - [ ]  Add search filter interfaces in file `/src/domain.types/<api/entity>/<api.entity>.search.types.ts`.
 - [ ]  **Input validator**
   - [ ]  Add input validator class in `/src/api/input.validators/<api/entity>.input.validator.ts` and add validation and domain model creation methods for each of the route.
 - [ ]  **Controller**
   - [ ]  Add controller class in `/src/api/controllers/<api/entity>.input.validator.ts` with corresponding action methods.
 - [ ]  **Service**
   - [ ]  Add service class in `/src/services/<api/entity>.input.validator.ts` and service methods.
   - [ ]  While adding service, please make sure that you inject the repository interfaces you need.
 - [ ]  **Database**
   - [ ]  **Repository Abstraction Interface** - Add repository abstraction interface in `/src/data/repository.interfaces/<api/entity>.repo.interface.ts`.
   - [ ]  **Concrete Database repository Implementation** 
     - [ ]  **Implementation** - Add your concrete implementation of the repository class. The location of this will be based on which database type and which ORM you may use. For default implementation with SQL databases with sequelize as ORM, the file can be added as `/src/data/database/sequelize/repositories/<api/entity>.repo.ts`. In case you are using MongoDB as your database, the location could be `/src/data/database/mongodb/repositories/<api/entity>.repo.ts`.
     - [ ]  **Dependency injection** - Please add the dependency injection entry for the concrete implementation against the repository interface in file `/src/startup/injector.ts`.
   - [ ]  **Models** - Add your models based on your database types. For default implementation using Sequelize, it will be at `/src/data/database/sequelize/models/<api/entity>.model.ts`. Please follow the conventions in definining models.
   - [ ]  **Model mappers** - Add model mapping classes in `/src/data/database/sequelize/mappers/<api/entity>.mapper.ts`. Model mappers mainly convert the extracted database models into output DTOs.
   - [ ]  **Migrations (Optional)** - You can also add your migrations optionally in folder `/src/data/database/sequelize/migrations`.
 - [ ]  **EHR** (FHIR storage) - If the api/entity you are implementing also needs to be stored in FHIR storage, you have to add the following artefacts.
   - [ ]  **EHR storage interface** - Define the EHR storage interface in `/src/modules/ehr/interfaces/<ehr-resource>.store.interface.ts`. 
   - [ ]  **EHR resource storage service** - Add storage service interface which wrapps the reference to the actual storage implementation in `/src/modules/ehr/services/<ehr-resource>.store.ts`.
   - [ ]  **Concrete FHIR provider implementation** - 
     - [ ]  **Implementation** - Add the concrete implementation of FHIR store class in specification/provider specific folder. By default, we are using Google FHIR storage API, so the file path-name will be `/src/modules/ehr/specifications/fhir/providers/gcp/<ehr-resource>.store.ts`.
     - [ ]  **Dependency injection** - Add dependency injection of the concrete type against the interface in the file `/src/modules/ehr/ehr.injector.ts`. This will make sure that correct provider implementation gets loaded against the interface.
     - [ ]  **FHIR JSON schema** - If you are using FHIR, please JSON file representing the FHIR resource schema in file `/src/modules/ehr/specifications/fhir/resources/<ehr-resource>.fhir.json`. This will help in understanding the scope of the schema which you have implemented for the FHIR resource type.
     - [ ]  **Optional types** - If you need to define some types (interfaces or enums) related to mapping of selected codes, chosen vocabulary, etc.; you can add those in file `/src/modules/ehr/specifications/fhir/types/<ehr-resource>.types.ts`.
   - [ ]  **Tests** - At this moment, we are only enforcing only FHIR resource unit tests. API tests are currently enforced through Postman runner/Newmann tests.
     - [ ]  **FHIR unit tests** - You should add your FHIR specific unit tests if you have added/updated a FHIR resource. The location of test will be `/src/tests/fhir.tests/<ehr-resource>.resource.test.ts`.

Please have a look at the existing implementation to understand the pattern of development of individual artefact types. Any deviation from this is discouraged unless it is absolutely necessary and approved.
