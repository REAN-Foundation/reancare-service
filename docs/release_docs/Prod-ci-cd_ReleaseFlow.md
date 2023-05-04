## PROD-CI-CD

Prod-CI-CD workflow can be use or trigger by Pushing code into main branch.
[prod-ci-cd_Workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/PROD-ci-cd_workflow.png?raw=true)
![prod](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/prod-ci-cd_example.png?raw=true)
### JOBS

#### Publish-Release
The Publish-Release will be performing the following steps.

* This job will create a new GitHub release and the versioning will be based on what label developer gave for the pull request.
* This job uses [release-drafter](https://github.com/release-drafter/release-drafter).

#### Deploy-ECS
The Deploy-ECS will be performing the following steps.

* This job login to ECR using creds and build a new ECR docker image with image tag using ID of release whcih Publish-Release job created for example ``` reancare:97777323 ```, then this job will create new version of Amazon ECS task definition with new docker image then it will deploy Amazon ECS task definition using Duplo API ``` https://reanfoundation.duplocloud.net/subscriptions/${{ secrets.DUPLO_ID }}/UpdateEcsService ``` and Authenticating using Duplo ID.
* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).

### Steps To Trigger Workflow

1. Once the Pull Request has been merge into main branch prod-ci-cd workflow will be triggered.
