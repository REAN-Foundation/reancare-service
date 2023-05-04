## PR-ci-cd
 
 PR-ci-cd can be trigger by creating a pull request from ``` Feature/* ``` branch to merge into develop branch.
 ![PR-ci-cd_workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/pr-ci-cd_workflow.png?raw=true)
 
### JOBS

 These are the jobs used in PR-ci-cd workflow
 
 #### CodeScan-ESLint
  This is the how CodeScan-ESLint job looks like
  In this job we are analyzes the code developer wrote against some rules for stylistic or programmatic errors.
 
  ![codescan-job](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/codescan.png?raw=true)
 
  * This job use static code analysis tool which identify problematic patterns found in application source code.
  * This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job. 
 
 #### Build-Docker-Image
 This is how Build-Docker-Image job looks like
 In this job we are validating whether ECR image building properly or not.
 
 ![build-docker-job](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/docker-build.png?raw=true)

  * This job create a docker image with image tag using branch name and short SHA of commit.
  * This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).  
 
### Steps To Trigger Workflow

 1. Create a branch with the prefix of feature, for Example ``` feature/test ``` .
 2. Then Create a Pull Request to merge into develop branch.

### Conclusion

 * By creating a pull request to merge into develop branch will trigger the Pr-ci-cd workflow, then wrokflow will the check whether problematic patterns found in    JavaScript code or not then it will create a docker image.
 * Example of PR-ci-cd Action ![Pr-ci-cd](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/Pr-ci-cd_example.png?raw=true)
