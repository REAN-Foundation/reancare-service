## Dev-ci-cd 

Dev-ci-cd can be use or trigger by pushing code into Develop branch.

### JOBS

These are the jobs used in Dev-ci-cd

#### Deploy-ECS

* This job uses 'dev' environment and login to ECR using creds and build a new ECR docker image with image tag using branch name and short SHA of commit for example ``` /reancare-service-dev-uat:develop_5e38e33 ```, Then this job will create new version of Amazon ECS task definition with new docker image then it will deploy Amazon ECS task definition using Duplo API.
* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).

### Steps To Trigger Workflow

1. Once the Pull Request has been merge into Develop branch Dev-ci-cd workflow will be triggered.

### Conclusion

* This workflow will be triggered after PR-ci-cd workflow which means whenever a Push event happens on the Develop branch will trigged Dev-ci-cd workflow.
* Then it will create a new docker image and create a new version of task definition with that image and deploy it. 
* Example of Dev-ci-cd Action ![Dev-ci-cd](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/Dev-ci-cd_example.png?raw=true)
