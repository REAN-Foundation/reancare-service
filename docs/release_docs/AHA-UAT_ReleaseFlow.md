# AHA UAT Release Workflow
Explaination of AHA UAT Release Workflow.
![AHA-uat](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/AHA-UAT_wrokflow.png?raw=true)
![aha-uat-workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/aha_uat_workflow.png?raw=true)

## AHA-UAT-CI-CD

This workflow uses two jobs: GitHub-ECR-Tag-Check and Deploy ECS to verify and deploy reancare-service release to aha-uat environment

### JOBS

#### CodeScan-ESLint

* This job use static code analysis tool which identify problematic patterns found in application source code.
* This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job.

#### GitHub-ECR-Tag-Check
The GitHub ECR Tag Check will be performing the following steps.

* This job will validate whether the given input release tag exists or not.
* This job get the GitHub release with the associated GitHub tag name with it and store the GitHub release ID.
* Then it will check ECR image tag with the same as GitHub release ID.

#### Deploy-ECS
The Deploy ECS will be performing the following steps.

* This job uses 'aha-uat' environment and login to ECR using creds and pull the ECR image which was created in PROD-CI-CD with the GitHub release ID Then this job will create new version of Amazon ECS task definition with new docker image then it will deploy Amazon ECS task definition using Duplo API.
* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).

### Steps To Trigger Workflow

1. Developer can run this workflow manually with a GitHub Tag_name as input parameter.

