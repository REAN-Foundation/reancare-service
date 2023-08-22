# REAN Platform Deployment Workflows

## PR-CI-CD Release Workflow

**Trigger Mode:** Automated

The PR Workflow is triggered automatically whenever a pull request (PR) with a source branch as a `feature/*` branch is created against the target branch as the `develop` branch.

### PR-CI-CD Release Workflow Overview

Release Process Workflow Diagram:
![PR-CI-CD Workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/pr-ci-cd_workflow.png?raw=true)

GitHub Action Workflow Execution:
![PR-CI-CD Example](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/Pr-ci-cd_example.png?raw=true)

### Workflow Jobs

#### Job: CodeScan-ESLint

In this job, we analyze the code written by developers against specific rules for stylistic or programmatic errors.

- Utilizes the [Super-linter](https://github.com/marketplace/actions/super-linter) action.
- Performs static code analysis to identify problematic patterns in the application's source code.

#### Job: Build-Docker-Image

In this job, we validate the Dockerfile and test the image build process to identify issues incurred during the build process due to recent code changes.

- Utilizes [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images) action.
- Creates a Docker image with a tag using the branch name and short SHA of commit, for example `feature/test_5e38e33`.

## Dev-CI-CD Release Workflow

**Trigger Mode:** Automated

The Dev Workflow is triggered automatically whenever a pull request is merged into the `develop` branch. The workflow builds the application and deploys the changes to the REAN Platform Development environment.

### Dev-CI-CD Release Workflow Overview

Release Process Workflow Diagram:
![Dev-CI-CD Workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/dev-ci-cd_workflow.png?raw=true)

GitHub Action Workflow Execution:
![Dev-CI-CD Example](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/Dev-ci-cd_example.png?raw=true)

### Workflow Jobs

#### Job: Deploy-ECS

The Deploy-ECS job performs the following steps:

- Utilizes [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images) action.
- Operates within the `dev` environment, logs into ECR using credentials, and builds a new ECR Docker image with an image tag based on the branch name and short SHA of commit, for example `/reancare-service-dev-uat:develop_5e38e33`.
- Creates a new version of the Amazon ECS task definition with the updated Docker image.
- Deploys the updated Amazon ECS task definition using the Duplo API.

## UAT-CI-CD Release Workflow

**Trigger Mode:** Automated

The UAT-CI-CD Workflow can be triggered in two ways:
1. By creating a pull request to merge into the `main` branch.
2. Whenever a branch with the prefix `release/` creates a pull request.

### UAT-CI-CD Release Workflow Overview

Release Process Workflow Diagram:
![UAT-CI-CD Workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/uat-ci-cd_workflow.png?raw=true)

GitHub Action Workflow Execution:
![UAT-CI-CD Example](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/Uat-ci-cd_example.png?raw=true)

### Workflow Jobs

#### Job: CodeScan-ESLint

The CodeScan ESLint job performs the following steps:

- Utilizes [Super-linter](https://github.com/marketplace/actions/super-linter) action.
- Performs static code analysis to identify problematic patterns in the application's source code.

#### Job: Label_Checks

The Label Checks job performs the following steps:

- Utilizes [pull-request-label-checker](https://github.com/marketplace/actions/label-checker-for-pull-requests) action.
- On a Pull Request event, checks whether the PR has labels such as major, minor, or patch.

#### Job: Deploy-ECS

The Deploy-ECS job performs the following steps:

- Utilizes [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images) action.
- Operates within the 'UAT' environment, logs into ECR using credentials, and builds a new ECR Docker image with an image tag using the ID of the release created by the Publish-Release job, for example `reancare:97777323`.
- Creates a new version of the Amazon ECS task definition with the updated Docker image.
- Deploys the updated Amazon ECS task definition using the Duplo API.

## PROD-CI-CD Release Workflow

**Trigger Mode:** Automated

The Prod Workflow is triggered automatically whenever a pull request is merged into the `main` branch. The workflow builds the application and deploys the changes to the REAN Platform Production environment.

### PROD-CI-CD Release Workflow Overview

Release Process Workflow Diagram:
![PROD-CI-CD Workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/PROD-ci-cd_workflow.png?raw=true)

GitHub Action Workflow Execution:
![PROD-CI-CD Example](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/prod-ci-cd_example.png?raw=true)

### Workflow Jobs

#### Job: Publish-Release

The Publish-Release job performs the following steps:

- Utilizes [release-drafter](https://github.com/release-drafter/release-drafter) action.
- Creates a new GitHub release with versioning based on the label assigned to the pull request by the developer.

#### Job: Deploy-ECS

The Deploy-ECS job performs the following steps:

- Utilizes [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images) action.
- Logs into ECR using credentials and builds a new ECR Docker image with an image tag using the ID of the release created by the Publish-Release job, for example `reancare:97777323`.
- Creates a new version of the Amazon ECS task definition with the updated Docker image.
- Deploys the updated Amazon ECS task definition using the Duplo API.
