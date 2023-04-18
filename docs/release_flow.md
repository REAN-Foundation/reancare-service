# About Release FLow

1. For general Workflow using Github actions guidance, you can refer to [Github Actions Guide](https://docs.github.com/en/actions/guides). 
2. We have different naming convention prefix of branch name depending on, In which branch devloper want to merge the branch
3. We have 7 active workflows, You can see all the workflow files here [Workflows](https://github.com/REAN-Foundation/reancare-service/tree/develop/.github/workflows).
4. Every worklfow file name should end with ``` *.yml ``` extention



## Branching Strategy

This is the overview of our Branch Strategy, How we are using workflows based on branch naming convention.

### Feature

Whenever a developer create a branch with the prefix of 'feature' then the Pull request should be raise on develop branch, It will trigger the PR-ci-cd workflow, After the merging of pull request into develop branch it will trigger the Dev-ci-cd workflow. 
 
 ```sh
 feature/**
 ```

### Release

Whenever a developer create a branch with the prefix of 'release' then the Pull Request should be raise on main branch, After that whenever developer push code on 'release' branch it will trigger the UAT-ci-cd workflow.

 ```sh
 release/**
 ```
 
# Getting started 
 
This is an explanation of how to use or trigger any workflow in our repository
 
## PR-ci-cd
 
* PR-ci-cd (Pull Request ci-cd) can be trigger by raising a pull request to develop branch.
* You can refer to full documentation of [PR-ci-cd](release_docs/Pr-ci-cd_ReleaseFlow.md).
 
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

## UAT-ci-cd

There are two ways to use or trigger UAT-ci-cd workflow
1. By creating a Pull Request to merge into MAIN branch
2. Whenever a Branch with prefix of 'release' create a pull request

### JOBS

These are the jobs used in UAT-ci-cd

#### CodeScan-ESLint

* This job use static code analysis tool which identify problematic patterns found in JavaScript code.
* This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job.

#### Label_Checks

* On event Pull Request this job will check wheter the Pull Request have one of major,minor,patch label or not.
* This job uses [pull-request-label-checker](https://github.com/marketplace/actions/label-checker-for-pull-requests). 

#### Deploy-ECS

* This job uses 'UAT' environment and login to ECR using creds and build a new ECR docker image with image tag using branch name and short SHA of commit for example ``` /reancare-service-dev-uat:develop_5e38e33 ```, Then this job will create new version of Amazon ECS task definition with new docker image then it will deploy Amazon ECS task definition using Duplo API.
* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).

### Steps To Trigger Workflow

1. Create a pull request to merge into Main branch.
2. Create a branch with prefix `release` then create a pull request to any branch.
For Example ``` release/test ```

### Conclusion

* This workflow will be trigger when a pull request merge into main branch or whenever a branch with prefix of 'release' create a pull request to merge into any branch then Uat-ci-cd workflow will check whether the Pull request have one of major, minor, patch label or not, After that it will create a new docker image and create a new version of task definition with that image and deploy it.
* Example of UAT-ci-cd Action ![UAT-ci-cd](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/Uat-ci-cd_example.png?raw=true)    

## PROD-ci-cd

Prod-ci-cd workflow can be use or trigger by Pushing code into main branch.

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

## AHA-UAT-ci-cd

* This workflow allows you to manually trigger a GitHub Action with a input Github ``` Tag_name ```, Without having to push or create a pull request.
* You can refer to full documentation of [AHA-Uat workflow](release_docs/AHA-UAT_ReleaseFlow.md)
 
## AHA-PROD-ci-cd

* This workflow allows you to manually trigger a GitHub Action with a input Github ``` Tag_name ```, Without having to push or create a pull request.
* You can refer to full documentation of [AHA-Prod workflow](release_docs/AHA-Prod_ReleaseFlow.md)

### Develop Branch Workflow Explained

1. Developer will create a Feature branch, Create a Pull Request to develop branch which will trigger PR-ci-cd workflow.
2. After the Pull request merge into develop branch which will Trigger DEV-ci-cd workflow.

### Main branch Workflow Explained

1. Developer will create a Release branch, Create a Pull Request to main branch which will trigger UAT-ci-cd workflow.
2. After the Pull equest merge into main branch which will trigger PROD-ci-cd workflow.

### AHA-Uat Workflow Explained

1. Developer manually Trigger AHA-UAT-ci-cd workflow with Github Tag_name as input parameter.

### AHA-PROD Workflow Explained

1. Developer manually Trigger AHA-PROD-ci-cd workflow with Github Tag_name as input parameter.

### Workflow diagram

![workflow_diagram](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/workflow_diagram.png?raw=true)
