# About Release FLow

1. For general Workflow using Github actions guidance, you can refer to [Github Actions Guide](https://docs.github.com/en/actions/guides). 
2. We have different naming convention prefix of branch name depending on, In which branch devloper want to merge the branch
3. We have 7 active workflows, You can see all the workflow files here [Workflows](https://github.com/REAN-Foundation/reancare-service/tree/develop/.github/workflows).
4. Every worklfow file name should end with ``` *.yml ``` extention



## Overview

This is the overview of Branch naming convention 

### Feature

Prefix feature should be use when developer wants to merge code in Develop branch
 ```sh
 feature/**
 ```

### Release

Prefix release should be use when developer wants to merge code in main branch
 ```sh
 release/**
 ```
 
# Getting started 
 
This is an explanation of how to use or trigger any workflow in our repository
 
## PR-ci-cd
 
 PR-ci-cd (Pull Request ci-cd) can be trigger by creating a pull request to merge into develop branch.
 
### JOBS

 These are the jobs used in PR-ci-cd workflow
 
 #### CodeScan-ESLint
 
  * This job use static code analysis tool which identify problematic patterns found in JavaScript code.
  * This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job. 
 
 #### Build-Docker-Image
 
  * This job create a docker image with image tag using branch name and short SHA of commit.
  * This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).  
 
### Steps To Trigger Workflow

 1. Create a branch with the prefix of feature, For Example ``` feature/test ``` .
 2. Then Create a Pull Request to merge into develop branch.

### Conclusion

 * By creating a pull request to merge into develop branch will trigger the Pr-ci-cd workflow, Then wrokflow will the check whether problematic patterns found in    JavaScript code or not then it will create a docker image.
 * Example of PR-ci-cd Action ![Pr-ci-cd](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/Pr-ci-cd_example.png?raw=true)
 
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

* This workflow will be triggered after UAT-ci-cd 
