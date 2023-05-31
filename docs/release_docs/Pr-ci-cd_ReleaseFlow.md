mode of trigger: ```Automated```
## PR-CI-CD
 
 PR-CI-CD can be trigger by creating a pull request from ``` Feature/* ``` branch to merge into develop branch.
 ![PR-ci-cd_workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/pr-ci-cd_workflow.png?raw=true)
 ![pr](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/Pr-ci-cd_example.png?raw=true)
 
### JOBS

 These are the jobs used in PR-ci-cd workflow
 
 #### CodeScan-ESLint
  In this job we are analyzes the code developer wrote against some rules for stylistic or programmatic errors.
 
  * This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job. 
  * This job use static code analysis tool which identify problematic patterns found in application source code.
 
 #### Build-Docker-Image
 In this job we are validating whether ECR image building properly or not.
 
 * This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).  
 * This job create a docker image with image tag using branch name and short SHA of commit.
