## UAT-ci-cd

There are two ways to use or trigger UAT-ci-cd workflow
1. By creating a Pull Request to merge into MAIN branch
2. Whenever a Branch with prefix of 'release' create a pull request
![uat-ci-cd_Workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/uat-ci-cd_workflow.png?raw=true)

### JOBS

These are the jobs used in UAT-ci-cd

#### CodeScan-ESLint
This is how CodeScan-ESLint job looks like

![codescan-eslint](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/codescan.png?raw=true)

* This job use static code analysis tool which identify problematic patterns found in JavaScript code.
* This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job.

#### Label_Checks
This is how Label_Checks job looks like

![label-checks](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/label-checks.png?raw=true)

* On event Pull Request this job will check wheter the Pull Request have one of major, minor , patch label or not.
* This job uses [pull-request-label-checker](https://github.com/marketplace/actions/label-checker-for-pull-requests). 

#### Deploy-ECS
This is how Deploy-ECS job looks like

![deploy-ecs](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/docker-build.png?raw=true)

* This job uses 'UAT' environment and login to ECR using creds and build a new ECR docker image with image tag using branch name and short SHA of commit for example ``` /reancare-service-dev-uat:develop_5e38e33 ```, then this job will create new version of Amazon ECS task definition with new docker image then it will deploy Amazon ECS task definition using Duplo API.
* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).

### Steps To Trigger Workflow

1. Create a pull request to merge into Main branch.
2. Create a branch with prefix `release` then create a pull request to any branch.
For Example ``` release/test ```

### Conclusion

* This workflow will be trigger when a pull request merge into main branch or whenever a branch with prefix of 'release' create a pull request to merge into any branch then Uat-ci-cd workflow will check whether the Pull request have one of major, minor, patch label or not, after that it will create a new docker image and create a new version of task definition with that image and deploy it.
* Example of UAT-ci-cd Action ![UAT-ci-cd](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/Uat-ci-cd_example.png?raw=true)
