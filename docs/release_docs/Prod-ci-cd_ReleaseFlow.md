mode of trigger: ```Automated```
## PROD-CI-CD

Prod Workflow is triggered automatically whenever any PR is merged into the main branch. The workflow builds the applications and deploys the changes to the RF Platform Production environment.
![prod-ci-cd_Workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/PROD-ci-cd_workflow.png?raw=true)

![prod](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/prod-ci-cd_example.png?raw=true)

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
