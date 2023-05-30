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

This is the overview of our Branch Strategy, how we are using workflows based on branch naming convention.
We are using GitFlow Branching here (Ref: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

main : the main branch serves as the stable and production-ready branch, where all the changes from release branches are merged and tested before deployment.
develop : the develop branch, where all the changes from feature branches are merged 
feature/* : the feature branch, individual features or enhancements are developed on separate branches, allowing for isolated development and easy collaboration before merging.
release/* : the release branch is a branch used for allowing isolated testing and preparation of the release before merging it into the main branch.
hotfix/* : the hotfix branch, hotfixes for critical issues are handled separately by creating dedicated branches and merging them directly into the main branch.
 
# Workflow Explained 
 
This is an explanation of how to use or trigger any workflow in our repository
 
## PR-ci-cd
 
* PR-ci-cd (Pull Request ci-cd) can be trigger by raising a pull request to develop branch.
* You can refer to full documentation of [PR-ci-cd](release_docs/Pr-ci-cd_ReleaseFlow.md).
 
## Dev-ci-cd 

* Dev-ci-cd can be use or trigger by pushing code into Develop branch.
* You can refer to full documentation of [DEV-ci-cd](release_docs/Dev-ci-cd_ReleaseFlow.md).


## UAT-ci-cd

* There are two ways to use or trigger UAT-ci-cd workflow
1. By creating a Pull Request to merge into MAIN branch
2. Whenever a Branch with prefix of 'release' create a pull request
* You can refer to full documentation of [UAT-ci-cd](release_docs/Uat-ci-cd_ReleaseFlow.md).


## PROD-ci-cd

* Prod-ci-cd workflow can be use or trigger by Pushing code into main branch.
* You can refer to full documentaion of [PROD-ci-cd](release_docs/Prod-ci-cd_ReleaseFlow.md)


## AHA-UAT-ci-cd

* This workflow allows you to manually trigger a GitHub Action with a input Github ``` Tag_name ```, without having to push or create a pull request.
* You can refer to full documentation of [AHA-Uat workflow](release_docs/AHA-UAT_ReleaseFlow.md)
 
## AHA-PROD-ci-cd

* This workflow allows you to manually trigger a GitHub Action with a input Github ``` Tag_name ```, without having to push or create a pull request.
* You can refer to full documentation of [AHA-Prod workflow](release_docs/AHA-Prod_ReleaseFlow.md)

## Developer to Main branch Workflow

This is the Explanation of entire worflow
![workflow_diagram](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/workflow_diagram.png?raw=true)

### Develop Branch Workflow Explained

1. Developer will create a Feature branch, create a Pull Request to develop branch which will trigger PR-ci-cd workflow.
2. After the Pull request merge into develop branch which will Trigger DEV-ci-cd workflow.

### Main branch Workflow Explained

1. Developer will create a Release branch, create a Pull Request to main branch which will trigger UAT-ci-cd workflow.
2. After the Pull request merge into main branch which will trigger PROD-ci-cd workflow.

