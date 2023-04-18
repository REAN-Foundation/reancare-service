## PROD-ci-cd

Prod-ci-cd workflow can be use or trigger by Pushing code into main branch.
[prod-ci-cd_Workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/PROD-ci-cd_workflow.png?raw=true)
### JOBS

These are the jobs used in UAT-ci-cd

#### Publish-Release

* This job will create a new Github release and the versioning will be based on what label developer gave for the pull request.
* This job uses [release-drafter](https://github.com/release-drafter/release-drafter).

#### Deploy-ECS

* This job uses 'PROD' environment and login to ECR using creds and build a new ECR docker image with image tag using ID of release whcih Publish-Release job created for example ``` reancare:97777323 ```, Then this job will create new version of Amazon ECS task definition with new docker image then it will deploy Amazon ECS task definition using Duplo API.
* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).

### Steps To Trigger Workflow

1. Once the Pull Request has been merge into main branch prod-ci-cd workflow will be triggered.

### Conclusion

* This workflow will be triggered after UAT-ci-cd workflow which means whenever a Push event happens on the main branch will trigger Prod-ci-cd workflow
* Then it will create a new docker image and create a new version of task definition with that image and deploy it.
* Example of PROD-ci-cd Action ![prod-ci-cd](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/prod-ci-cd_example.png?raw=true)
