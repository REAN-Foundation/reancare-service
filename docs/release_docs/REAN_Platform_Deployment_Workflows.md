# REAN Platform Deployment workflows

## PR-CI-CD
Mode of trigger: ```Automated```

 PR Workflow is triggered automatically whenever a PR with source branch as a feature/* branch is created against the target branch as develop branch.
 
 Release Process Workflow Diagram.
 ![PR-ci-cd_workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/pr-ci-cd_workflow.png?raw=true)
 
 GitHub Action Workflow run.
 ![pr](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/Pr-ci-cd_example.png?raw=true)
 
### JOBS

 The PR workflow uses TWO jobs:
 
 #### CodeScan-ESLint
  In this job, we analyse the code developer wrote against some rules for stylistic or programmatic errors.
 
  * This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job. 
  * This job uses a static code analysis tool which identifies problematic patterns found in application source code.
 
 #### Build-Docker-Image
 In this job, we validate the Dockerfile and test the image build process to identify any issues incurred in the build process to recent code changes.
 
 * This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).  
 * This job create a docker image with image tag using branch name and short SHA of commit for example ```feature/test_5e38e33```



## Dev-CI-CD
Mode of trigger: ```Automated```

Dev Workflow is triggered automatically whenever any PR is merged into the develop branch. The workflow builds the applications and deploys the changes to the RF Platform Development environment.

Release Process Workflow Diagram.
![Dev-ci-cd_workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/dev-ci-cd_workflow.png?raw=true)

GitHub Action Workflow run.
![dev](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/Dev-ci-cd_example.png?raw=true)

### JOBS

#### Deploy-ECS
The Deploy ECS will be performing the following steps

* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).
* This job uses 'dev' environment and login to ECR using creds and build a new ECR docker image with image tag using branch name and short SHA of commit for example ``` /reancare-service-dev-uat:develop_5e38e33 ```
* Then it will create new version of Amazon ECS task definition with new docker image and deploy Amazon ECS task definition using Duplo API.


## UAT-CI-CD
Mode of trigger: ```Automated```

There are two ways to use or trigger uat-CI-CD workflow
1. By creating a Pull Request to merge into MAIN branch
2. Whenever a Branch with prefix of 'release/' create a pull request

Release Process Workflow Diagram.
![uat-ci-cd_Workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/uat-ci-cd_workflow.png?raw=true)

GitHub Action Workflow run.
![uat](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/Uat-ci-cd_example.png?raw=true)

### JOBS

#### CodeScan-ESLint
The CodeScan ESLint will be performing the following steps.

* This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job.
* This job use static code analysis tool which identify problematic patterns found in application source code.

#### Label_Checks
The Label Checks will be performing the following steps.

* This job uses [pull-request-label-checker](https://github.com/marketplace/actions/label-checker-for-pull-requests).
* On event Pull Request this job will check wheter the Pull Request have one of major, minor , patch label or not. 

#### Deploy-ECS
The Deploy ECS will be performing the following steps.

* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).
* This job uses 'UAT' environment and login to ECR using creds and build a new ECR docker image with image tag using branch name and short SHA of commit for example ``` /reancare-service-dev-uat:develop_5e38e33 ```. 
* Then it will create new version of Amazon ECS task definition with new docker image and deploy Amazon ECS task definition using Duplo API.


## PROD-CI-CD
Mode of trigger: ```Automated```

Prod Workflow is triggered automatically whenever any PR is merged into the main branch. The workflow builds the applications and deploys the changes to the RF Platform Production environment.

Release Process Workflow Diagram.
![prod-ci-cd_Workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/PROD-ci-cd_workflow.png?raw=true)

GitHub Action Workflow run.
![prod](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/prod-ci-cd_example.png?raw=true)

### JOBS

#### Publish-Release
The Publish-Release will be performing the following steps.

* This job uses [release-drafter](https://github.com/release-drafter/release-drafter).
* This job will create a new GitHub release and the versioning will be based on what label developer gave for the pull request.

#### Deploy-ECS
The Deploy-ECS will be performing the following steps.

* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).
* This job login to ECR using creds and build a new ECR docker image with image tag using ID of release whcih Publish-Release job created for example ``` reancare:97777323 ```.
* Then it will create new version of Amazon ECS task definition with new docker image and deploy Amazon ECS task definition using Duplo API.
