# About Release FLow

1. For general Workflow using Github actions guidance, you can refer to [Github Actions Guide](https://docs.github.com/en/actions/guides). 
2. We have different naming convention prefix of branch name depending on, In which branch devloper want to merge the branch
3. We have 7 active workflows, You can see all the workflow files here [Workflows](https://github.com/REAN-Foundation/reancare-service/tree/develop/.github/workflows).
4. Every worklfow file name should end with ``` *.yml ``` extention


## Contents
Contents
- [Branching Strategy](##Branching Strategy)
  - [Workflow Examples](###Feature)



## Branching Strategy

This is the overview of our Branch Strategy, How we are using workflows based on branch naming convention.

### Feature

Whenever a developer create a branch with the prefix of 'feature' then the Pull request should be raise on develop branch, It will trigger the PR-ci-cd workflow, After the merging of pull request into develop branch it will trigger the Dev-ci-cd workflow. 
 
 ```sh
 feature/**
 ```

### Release

Whenever a developer create a branch with the prefix of 'release' then the Pull Request should be raise on main branch, After that whenever developer push code on 'release' branch it will trigger the UAT-ci-cd workflow.

 ```sh
 release/**
 ```
 
# Getting started 
 
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

* This workflow allows you to manually trigger a GitHub Action with a input Github ``` Tag_name ```, Without having to push or create a pull request.
* You can refer to full documentation of [AHA-Uat workflow](release_docs/AHA-UAT_ReleaseFlow.md)
 
## AHA-PROD-ci-cd

* This workflow allows you to manually trigger a GitHub Action with a input Github ``` Tag_name ```, Without having to push or create a pull request.
* You can refer to full documentation of [AHA-Prod workflow](release_docs/AHA-Prod_ReleaseFlow.md)

## Developer to Main branch Workflow

This is the Explanation of entire worflow
![workflow_diagram](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/workflow_diagram.png?raw=true)

### Develop Branch Workflow Explained

1. Developer will create a Feature branch, Create a Pull Request to develop branch which will trigger PR-ci-cd workflow.
2. After the Pull request merge into develop branch which will Trigger DEV-ci-cd workflow.

### Main branch Workflow Explained

1. Developer will create a Release branch, Create a Pull Request to main branch which will trigger UAT-ci-cd workflow.
2. After the Pull request merge into main branch which will trigger PROD-ci-cd workflow.

### AHA-Uat Workflow Explained

1. Developer manually Trigger AHA-UAT-ci-cd workflow with Github Tag_name as input parameter.

### AHA-PROD Workflow Explained

1. Developer manually Trigger AHA-PROD-ci-cd workflow with Github Tag_name as input parameter.
