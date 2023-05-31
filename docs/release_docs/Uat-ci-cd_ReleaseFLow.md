mode of trigger: ```On-Demand``` ```Automated```
## UAT-CI-CD

There are two ways to use or trigger uat-CI-CD workflow
1. By creating a Pull Request to merge into MAIN branch
2. Whenever a Branch with prefix of 'release/' create a pull request
![uat-ci-cd_Workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/uat-ci-cd_workflow.png?raw=true)
![uat](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/Uat-ci-cd_example.png?raw=true)

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
