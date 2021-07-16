# How to setup development environment

## Technology stack
1. [Node.js](https://nodejs.org/en/) (Minimum version 12.14.1)
2. [TypeScript](https://www.typescriptlang.org/) (Minimum version 4.2.4)
3. [Sequelize](sequelize.org) - as a default module for SQL databases if you are fine with default version
4. [MySQL](https://dev.mysql.com/downloads/mysql/) - (MySQL Community Server 8.0.25) or [PostgreSQL](https://www.postgresql.org/download/) - (Minimum Version 12.x)
5. Optional: If you want to use FHIR service, user the one using version R4. Default is [GCP FHIR](https://cloud.google.com/healthcare/docs/concepts/fhir) for which you have enable the GCP API for FHIR and set the creds.


## Development machine set-up

* Clone this repository
  
  `clone git@github.com:REAN-Foundation/reancare-service.git <your-local-folder>`

  or
  fork the repository
  <img src="./fork_repo.png" width="400">

* Install all the prerequisites as listed in [technology stack](#technology-stack).
* Open the root directory of the folder where you have cloned/forked the repository in Visual Studio Code.
* Go to terminal of VSCode and type `npm install`. This will install all the dependency packages.
* Open <your-root-folder>/.env.sample file and change the name to .env. Update the environment variables in .env file to the ones which are available on your machine.
* Make sure you have <your-root-folder>/.vscode/launch.json file available.
* Click on debug button on left panel and you should see 'Launch Program' option against 'RUN AND DEBUG' label. Click on 'Play' button against 'Launch Program' to start the service in debug mode.
* You should be able to see server start messages.
* Congratulations, your REANCare service is up and running!

