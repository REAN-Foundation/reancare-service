# AHA-Prod Workflow
Explaination of AHA-PROD workflow.
![AHA-PROD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/AHA-PROD_Workflow.png?raw=true)

## AHA-PROD-ci-cd

This workflow allows you to manually trigger a GitHub Action with a input GitHub ``` Tag_name ```, without having to push or create a pull request

### JOBS

#### GitHub-ECR-Tag-Check
The GitHub ECR Tag Check will be performing the following steps.

* This job will validate whether the given input release tag exists or not
* This job get the GitHub release with the associated GitHub tag name with it and store the GitHub release ID.
* Then it will check ECR image tag with the same as GitHub release ID.
* This job uses [mukunku/tag-exists-action](https://github.com/marketplace/actions/tag-exists-action), [git-get-release-action](https://github.com/marketplace/actions/git-get-release-action).

#### Deploy-ECS
The Deploy ECS will be performing the following steps

* This job uses 'aha-PROD' environment and login to ECR using creds and pull the ECR image which was created in PROD-ci-cd with the GitHub release ID Then this job will create new version of Amazon ECS task definition with new docker image then it will deploy Amazon ECS task definition using Duplo API.
* This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).

### Steps To Trigger Workflow

1. Developer can run this workflow manually with a GitHub Tag_name as input parameter.

### Conclusion

* This workflow checks the input GitHub Tag name is correct or not then it will get the GitHub release associated with the tag name and store the GitHub release ID then it will check whether the ECR image tag which was created in PROD-ci-cd is same as Gitub release ID or not then it will pull that ECR image and create a new version of task definition with that image and deploy it.
* Example of AHA-PROD-ci-cd workflow file [aha-prod-ci-cd](https://github.com/REAN-Foundation/reancare-service/blob/feature/aha_fix/.github/workflows/aha-prod-ci-cd.yml)
