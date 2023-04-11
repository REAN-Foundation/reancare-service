# Entire Release FLow Explained

1. For general Workflow using Github actions guidance, you can refer to [Github Actions Guide](https://docs.github.com/en/actions/guides). 
2. We have different naming convention prefix of branch name depending on, In which branch devloper want to merge the branch
3. We have 7 active workflows, You can see all the workflow files here [Workflows](https://github.com/REAN-Foundation/reancare-service/tree/develop/.github/workflows).
4. Every worklfow file name should end with ``` *.yml ``` extention



## Overview

This is the overview of Branch naming convention 

### Feature

Prefix feature should be use when developer wants to merge code in Develop branch
 ```sh
 feature/**
 ```

### Release

Prefix release should be use when developer wants to merge code in main branch
 ```sh
 release/**
 ```
 
# Getting started 
 
This is an explanation of how to use or trigger any workflow in our repository
 
## PR-ci-cd
 
 PR-ci-cd (Pull Request ci-cd) can be trigger by creating a pull request to develop branch
 
### JOBS

These are the jobs used in PR-ci-cd workflow
 
#### CodeScan-ESLint
 
 * This job use static code analysis tool which identify problematic patterns found in JavaScript code.
 * This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job. 
 
 #### Build-Docker-Image
 
 * This job create a docker image with image tag using branch name and short SHA of commit and push into reancare/services repository.
 * This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).  
 
### Steps To Trigger Workflow

1. create a branch with the prefix of feature
   for example ``` feature/test ```

