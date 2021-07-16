# Design considerations

The following are the goals of the current design of the system.

1. __Open architecture__ - 
   __Use default or bring your own!__ The current design supports freedom to choose individual components in multple areas. The service currently gives out-of-the-box default modules, but if somebody wants to replace the default module with their own, it is perfectly possible. The replacing modules have to support a given interface or need to be wrapped to support the interfaces. Dependency injection has been utilized to have a loose coupling between different areas of the service. The areas which currently support the replacable modules are - 
   *  __Authentication and Authorization__ - You can plugg in your own own auth service.
   *  __Database engines__ - Through basic repository interface. Default is any SQL database through [Sequelize ORM](https://sequelize.org/). Tested with MySQL and PostgreSQL. So the possibilities are -
      *  SQL-based (currently supported through sequelize) - e.g. MySQL, PostgreSQL, SQL server, SQLite,...
      *  NoSQL based databases such as MongoDB
   *  __FHIR storage__ - Current default implementation supports [Google's Healthcare FHIR api (Version R4)](https://cloud.google.com/healthcare/docs/concepts/fhir), but it should be very easy to add Azure FHIR API or Hapi server.
   *  __Clinical NLP service module__ - Currently this service is not fully integrated with this code base, but the work is in progress. The service supports out-of-the-box provider plugins for [Google Healtcare Natural language API](https://cloud.google.com/healthcare/docs/concepts/nlp) and AWS [Amazon Comprehend Medical](https://aws.amazon.com/comprehend/medical/).

    Eventually following modules will have plug and play architecture - 
    * __Care plan module__
    * __Emergency protocol module__
    * __Resource management module__
    * __Appointment service module__
    * __Scheduler__
  
2. __Domain driven design with clear separation of concerns__
    * Domain specific definitions of entities
    * Code against interface
    * Testability of individual components

3. __Extensible core functionalities__ - with emphasis on customization.