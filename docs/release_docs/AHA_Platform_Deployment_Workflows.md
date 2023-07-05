# AHA Platform Deployment Workflows

## AHA-PROD-CI-CD
Mode of trigger: ```On-Demand```

Parameter : 
* ```Tag_name```: Please provide the GitHub tag name that the user wishes to use for deployment, For example ```v1.0.1```

This workflow uses two jobs: GitHub-ECR-Tag-Check and Deploy ECS to verify and deploy ```reancare-service``` release to ```aha-prod``` environment

### AHA Prod Release Workflow

Release Process Workflow Diagram.
![AHA-PROD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/AHA-PROD_Workflow.png?raw=true)

GitHub Action Workflow run
![AHA-PROD-JOB](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/aha_github_workflow.png?raw=true)



### JOBS

#### GitHub-ECR-Tag-Check
The GitHub ECR Tag Check will be performing the following steps.

* This job uses [mukunku/tag-exists-action](https://github.com/marketplace/actions/tag-exists-action), [git-get-release-action](https://github.com/marketplace/actions/git-get-release-action).
* This job will validate whether the given input release tag exists or not
* This job gets the GitHub release with the associated GitHub tag name with it and store the GitHub release ID.
* Then it will check ECR image tag with the same as GitHub release ID.

#### Deploy-ECS
The Deploy ECS will be performing the following steps

* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).
* This job uses 'aha-prod' environment and login to ECR using creds and pull the ECR image which was created in PROD-CI-CD with the GitHub release ID.
* Then it will create new version of Amazon ECS task definition with new docker image and deploy Amazon ECS task definition using Duplo API.



## AHA-UAT-CI-CD
Mode of trigger: ```On-Demand```

Parameter : 
* ```Tag_name```: Please provide the GitHub tag name that the user wishes to use for deployment, For example ```v1.0.1```

This workflow uses two jobs: GitHub-ECR-Tag-Check and Deploy ECS to verify and deploy ```reancare-service``` release to ```aha-uat``` environment

### AHA UAT Release Workflow

Release Process Workflow Diagram..
![AHA-uat](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/AHA-UAT_wrokflow.png?raw=true)

GitHub Action Workflow run
![aha-uat-workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/aha_uat_workflow.png?raw=true)


### JOBS

#### CodeScan-ESLint

* This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job.
* This job use static code analysis tool which identify problematic patterns found in application source code.

#### GitHub-ECR-Tag-Check
The GitHub ECR Tag Check will be performing the following steps.


* This job uses [mukunku/tag-exists-action](https://github.com/marketplace/actions/tag-exists-action), [git-get-release-action](https://github.com/marketplace/actions/git-get-release-action).
* This job will validate whether the given input release tag exists or not.
* This job get the GitHub release with the associated GitHub tag name with it and store the GitHub release ID.
* Then it will check ECR image tag with the same as GitHub release ID.

#### Deploy-ECS
The Deploy ECS will be performing the following steps.

* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).
* This job uses 'aha-uat' environment and login to ECR using creds and pull the ECR image which was created in PROD-CI-CD with the GitHub release ID.
* Then it will create new version of Amazon ECS task definition with new docker image and deploy Amazon ECS task definition using Duplo API.


