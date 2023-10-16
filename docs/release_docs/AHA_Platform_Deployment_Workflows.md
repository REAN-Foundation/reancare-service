# AHA Platform Deployment Workflows Documentation

## AHA-PROD-CI-CD Release Workflow

**Trigger Mode:** On-Demand

**Parameters:**
- `Tag_name`: Please provide the GitHub tag name that the user wishes to use for deployment. For example, `v1.0.1`.

This workflow involves two jobs: `GitHub-ECR-Tag-Check` and `Deploy-ECS`, which are responsible for validating and deploying the `reancare-service` release to the `aha-prod` environment.

### AHA-PROD Release Workflow Overview

The following diagram illustrates the high-level process of the AHA-PROD release workflow:
![AHA-PROD Workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/AHA-PROD_Workflow.png?raw=true)

Visual representation of the GitHub Action Workflow execution:
![AHA-PROD Job Execution](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/aha_github_workflow.png?raw=true)

### Workflow Jobs

#### Job: GitHub-ECR-Tag-Check

The `GitHub-ECR-Tag-Check` job performs the following steps:

- Utilizes the [mukunku/tag-exists-action](https://github.com/marketplace/actions/tag-exists-action) and [git-get-release-action](https://github.com/marketplace/actions/git-get-release-action) actions.
- Validates the existence of the provided release tag.
- Retrieves the GitHub release associated with the given tag and stores the release ID.
- Compares the ECR image tag with the retrieved GitHub release ID to ensure consistency.

#### Job: Deploy-ECS

The `Deploy-ECS` job performs the following steps:

- Utilizes the [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images) action.
- Operates within the `aha-prod` environment, authenticates with ECR using credentials, and pulls the ECR image generated in the `AHA-PROD-CI-CD` workflow using the GitHub release ID.
- Generates a new version of the Amazon ECS task definition containing the updated Docker image.
- Deploys the updated Amazon ECS task definition using the Duplo API.

---

## AHA-UAT-CI-CD Release Workflow

**Trigger Mode:** On-Demand

**Parameters:**
- `Tag_name`: Please provide the GitHub tag name that the user wishes to use for deployment. For example, `v1.0.1`.

This workflow also comprises two jobs: `CodeScan-ESLint`, `GitHub-ECR-Tag-Check`, and `Deploy-ECS`, which validate and deploy the `reancare-service` release to the `aha-uat` environment.

### AHA-UAT Release Workflow Overview

The following diagram illustrates the overall process of the AHA-UAT release workflow:
![AHA-UAT Workflow](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/AHA-UAT_workflow.png?raw=true)

Visual representation of the GitHub Action Workflow execution:
![AHA-UAT Job Execution](https://github.com/REAN-Foundation/reancare-service/blob/develop/assets/images/aha_uat_workflow.png?raw=true)

### Workflow Jobs

#### Job: CodeScan-ESLint

- Uses the [Super-linter](https://github.com/marketplace/actions/super-linter) action to perform static code analysis.
- Identifies problematic patterns within the application's source code.

#### Job: GitHub-ECR-Tag-Check

The `GitHub-ECR-Tag-Check` job executes the following steps:

- Utilizes the [mukunku/tag-exists-action](https://github.com/marketplace/actions/tag-exists-action) and [git-get-release-action](https://github.com/marketplace/actions/git-get-release-action) actions.
- Validates the presence of the specified release tag.
- Retrieves the GitHub release associated with the provided tag and stores the release ID.
- Compares the ECR image tag with the obtained GitHub release ID for consistency.

#### Job: Deploy-ECS

The `Deploy-ECS` job operates as follows:

- Utilizes the [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images) action.
- Functions within the `aha-uat` environment, authenticates with ECR using credentials, and retrieves the ECR image generated during the `AHA-PROD-CI-CD` workflow using the GitHub release ID.
- Creates a new version of the Amazon ECS task definition containing the updated Docker image.
- Deploys the updated Amazon ECS task definition using the Duplo API.
