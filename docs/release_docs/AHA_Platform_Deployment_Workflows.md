# AHA Platform Deployment Workflows

## AHA-PROD-CI-CD
Mode of trigger: ```On-Demand```

Parameter : 
* ```Tag_name```: Please provide the GitHub tag name that the user wishes to use for deployment, For example ```v1.0.1```

This workflow uses two jobs: GitHub-ECR-Tag-Check and Deploy ECS to verify and deploy ```reancare-service``` release to ```aha-prod``` environment

### AHA Prod Release Workflow

Release Process Workflow Diagram.
![AHA-PROD](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/AHA-PROD_Workflow.png?raw=true)

GitHub Action Workflow run
![AHA-PROD-JOB](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/aha_github_workflow.png?raw=true)



### JOBS

#### GitHub-ECR-Tag-Check
The GitHub ECR Tag Check will be performing the following steps.

* This job uses [mukunku/tag-exists-action](https://github.com/marketplace/actions/tag-exists-action), [git-get-release-action](https://github.com/marketplace/actions/git-get-release-action).
* This job will validate whether the given input release tag exists or not
* This job gets the GitHub release with the associated GitHub tag name with it and stores the GitHub release ID.
* Then it will check the ECR image tag with the same GitHub release ID.

#### Deploy-ECS
The Deploy ECS will be performing the following steps

* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).
* This job uses the 'aha-prod' environment and login into ECR using creds and pulls the ECR image which was created in PROD-CI-CD with the GitHub release ID.
* Then it will create a new version of the Amazon ECS task definition with a new docker image and deploy the Amazon ECS task definition using Duplo API.



## AHA-UAT-CI-CD
Mode of trigger: ```On-Demand```

Parameter : 
* ```Tag_name```: Please provide the GitHub tag name that the user wishes to use for deployment, For example ```v1.0.1```

This workflow uses two jobs: GitHub-ECR-Tag-Check and Deploy ECS to verify and deploy ```reancare-service``` release to ```aha-uat``` environment

### AHA UAT Release Workflow

Release Process Workflow Diagram.
![AHA-uat](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/AHA-UAT_wrokflow.png?raw=true)

GitHub Action Workflow run
![aha-uat-workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/aha_uat_workflow.png?raw=true)


### JOBS

#### CodeScan-ESLint

* This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job.
* This job uses a static code analysis tool that identifies problematic patterns found in application source code.

#### GitHub-ECR-Tag-Check
The GitHub ECR Tag Check will be performing the following steps.


* This job uses [mukunku/tag-exists-action](https://github.com/marketplace/actions/tag-exists-action), [git-get-release-action](https://github.com/marketplace/actions/git-get-release-action).
* This job will validate whether the given input release tag exists or not.
* This job gets the GitHub release with the associated GitHub tag name with it and stores the GitHub release ID.
* Then it will check the ECR image tag with the same GitHub release ID.

#### Deploy-ECS
The Deploy ECS will be performing the following steps.

* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).
* This job uses the 'aha-uat' environment and login into ECR using creds and pulls the ECR image which was created in PROD-CI-CD with the GitHub release ID.
* Then it will create a new version of the Amazon ECS task definition with a new docker image and deploy the Amazon ECS task definition using Duplo API.


