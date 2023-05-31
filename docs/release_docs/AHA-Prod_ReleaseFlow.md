mode of trigger: ```On-Demand```

## AHA-PROD-CI-CD

This workflow uses two jobs: GitHub-ECR-Tag-Check and Deploy ECS to verify and deploy ```reancare-service``` release to ```aha-prod``` environment

### JOBS

#### GitHub-ECR-Tag-Check
The GitHub ECR Tag Check will be performing the following steps.

* This job uses [mukunku/tag-exists-action](https://github.com/marketplace/actions/tag-exists-action), [git-get-release-action](https://github.com/marketplace/actions/git-get-release-action).
* This job will validate whether the given input release tag exists or not
* This job get the GitHub release with the associated GitHub tag name with it and store the GitHub release ID.
* Then it will check ECR image tag with the same as GitHub release ID.

#### Deploy-ECS
The Deploy ECS will be performing the following steps

* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).
* This job uses 'aha-prod' environment and login to ECR using creds and pull the ECR image which was created in PROD-CI-CD with the GitHub release ID.
* Then it will create new version of Amazon ECS task definition with new docker image and deploy Amazon ECS task definition using Duplo API.

# AHA Prod Release Workflow

Release Process Workflow Diagram.
![AHA-PROD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/AHA-PROD_Workflow.png?raw=true)

GitHub Action Workflow run
![AHA-PROD-JOB](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/aha_github_workflow.png?raw=true)

