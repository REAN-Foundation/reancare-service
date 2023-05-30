# About Release FLow

1. For general guidance about using GitHub actions, you can take a look at [Github Actions Guide](https://docs.github.com/en/actions/guides). 
2. We have a total of 7 active release workflows. These are located under [Workflows](https://github.com/REAN-Foundation/reancare-service/tree/develop/.github/workflows).

## Table Of Contents
- [Branching Strategy](#Branching-Strategy)
  - [Feature](#Feature-Branch)
  - [Release](#Release-Branch)
- [Workflow Explained](#Workflow-Explained)
  - [PR-ci-cd](#PR-ci-cd)
  - [Dev-ci-cd](#Dev-ci-cd)
  - [UAT-ci-cd](#UAT-ci-cd)
  - [PROD-ci-cd](#PROD-ci-cd)
  - [AHA-UAT-ci-cd](#AHA-UAT-ci-cd)
  - [AHA-PROD-ci-cd](#AHA-PROD-ci-cd)
- [Developer to Main branch Workflow](#Developer-to-Main-branch-Workflow)
  - [Develop Branch Workflow Explained](#Develop-Branch-Workflow-Explained)
  - [Main branch Workflow Explained](#Main-branch-Workflow-Explained)


## Branching Strategy

We are using GitFlow Branching [here](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

* main : The main branch serves as the stable and production-ready branch, where all the changes from release branches are merged and tested before deployment.
* develop : The develop branch, where all the changes from feature branches are merged 
* feature/* : The feature branch, individual features or enhancements are developed on separate branches, allowing for isolated development and easy collaboration before merging.
* release/* : The release branch is a branch used for allowing isolated testing and preparation of the release before merging it into the main branch.
* hotfix/* : The hotfix branch, hotfixes for critical issues are handled separately by creating dedicated branches and merging them directly into the main branch.
 
# Release Workflows 
 
There are different types of workflows designed for the type of source branch used based on the GitFlow workflow and the deployment targets as explained below
 
* [PR-CI-CD](release_docs/Pr-ci-cd_ReleaseFlow.md)
* [Dev-CI-CD](release_docs/Dev-ci-cd_ReleaseFlow.md).
* [UAT-CI-CD](release_docs/Uat-ci-cd_ReleaseFlow.md).
* [PROD-CI-CD](release_docs/Prod-ci-cd_ReleaseFlow.md).
* [AHA-UAT-CI-CD](release_docs/AHA-UAT_ReleaseFlow.md).
* [AHA-PROD-CI-CD](release_docs/AHA-Prod_ReleaseFlow.md).

## Developer to Main branch Workflow

This is the Explanation of entire worflow
![workflow_diagram](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/workflow_diagram.png?raw=true)

### Develop Branch Workflow Explained

1. Developer will create a Feature branch, create a Pull Request to develop branch which will trigger PR-ci-cd workflow.
2. After the Pull request merge into develop branch which will Trigger DEV-ci-cd workflow.

### Main branch Workflow Explained

1. Developer will create a Release branch, create a Pull Request to main branch which will trigger UAT-ci-cd workflow.
2. After the Pull request merge into main branch which will trigger PROD-ci-cd workflow.

