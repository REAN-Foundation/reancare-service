# About Release FLow

1. For general guidance about using GitHub actions, you can take a look at [Github Actions Guide](https://docs.github.com/en/actions/guides). 
2. We have a total of 7 active release workflows. These are located under [Workflows](https://github.com/REAN-Foundation/reancare-service/tree/develop/.github/workflows).

## Table Of Contents
- [Branching Strategy](#Branching-Strategy)
  - [Feature](#Feature-Branch)
  - [Release](#Release-Branch)
- [Develop to Main Branch Workflow](#Develop-to-Main-branch-Workflow)
  - [Develop Branch Workflow](#Develop-Branch-Workflow)
  - [Main branch Workflow](#Main-branch-Workflow)
- [Release Workflows](#Release-Workflows)
  - [PR-ci-cd](#PR-CI-CD)
  - [Dev-ci-cd](#Dev-ci-cd)
  - [UAT-ci-cd](#UAT-ci-cd)
  - [PROD-ci-cd](#PROD-ci-cd)
  - [AHA-UAT-ci-cd](#AHA-UAT-ci-cd)
  - [AHA-PROD-ci-cd](#AHA-PROD-ci-cd)



## Branching Strategy

We are using GitFlow Branching [here](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

* ```main``` : The main branch serves as the stable and production-ready branch, where all the changes from release branches are merged and tested before deployment.
* ```develop``` : The develop branch, where all the changes from feature branches are merged 
* ```feature/*``` : The feature branch, individual features or enhancements are developed on separate branches, allowing for isolated development and easy collaboration before merging.
* ```release/*``` : The release branch is a branch used for allowing isolated testing and preparation of the release before merging it into the main branch.
* ```hotfix/*``` : The hotfix branch, hotfixes for critical issues are handled separately by creating dedicated branches and merging them directly into the main branch.

## Develop to Main Branch Workflow

The diagram below explains the end-to-end process and stages for promoting the code from the develop branch to the master branch.

![workflow_diagram](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/workflow_diagram.png?raw=true)

### Develop Branch Workflow

1. Developer will create a Feature branch, create a Pull Request to develop branch which will trigger PR-ci-cd workflow.
2. After the Pull request merge into develop branch which will Trigger DEV-ci-cd workflow.

### Main branch Workflow

1. Developer will create a Release branch, create a Pull Request to main branch which will trigger UAT-ci-cd workflow.
2. After the Pull request merge into main branch which will trigger PROD-ci-cd workflow.
 
# Release Workflows 
 
There are different types of workflows designed for the type of source branch used based on the GitFlow workflow and the deployment targets as explained below

### REAN Foundation Platform Workflows

* [PR-CI-CD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/docs/release_docs/REAN_Platform_Deployment_Workflows.md#pr-ci-cd)
* [Dev-CI-CD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/docs/release_docs/REAN_Platform_Deployment_Workflows.md#dev-ci-cd).
* [UAT-CI-CD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/docs/release_docs/REAN_Platform_Deployment_Workflows.md#uat-ci-cd).
* [PROD-CI-CD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/docs/release_docs/REAN_Platform_Deployment_Workflows.md#prod-ci-cd).

### Customer Workflows

* [AHA-UAT-CI-CD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/docs/release_docs/AHA_Platform_Deployment_Workflows.md#aha-uat-ci-cd).
* [AHA-PROD-CI-CD](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/docs/release_docs/AHA_Platform_Deployment_Workflows.md#aha-prod-ci-cd).


