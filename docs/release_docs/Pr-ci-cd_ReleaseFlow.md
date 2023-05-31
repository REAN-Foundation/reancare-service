mode of trigger: ```Automated```
## PR-CI-CD
 
 PR Workflow is triggered automatically whenever a PR with source branch as a feature/* branch is created against the target branch as develop branch.
 ![PR-ci-cd_workflow](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/pr-ci-cd_workflow.png?raw=true)
 ![pr](https://github.com/REAN-Foundation/reancare-service/blob/feature/flow_documentation/assets/images/Pr-ci-cd_example.png?raw=true)
 
### JOBS

 The PR workflow uses TWO jobs:
 
 #### CodeScan-ESLint
  In this job, we analyse the code developer wrote against some rules for stylistic or programmatic errors.
 
  * This job uses [Super-linter](https://github.com/marketplace/actions/super-linter) action to run this job. 
  * This job uses a static code analysis tool which identifies problematic patterns found in application source code.
 
 #### Build-Docker-Image
 In this job, we validate the Dockerfile and test the image build process to identify any issues incurred in the build process to recent code changes.
 
 * This job uses [docker/build-push-action](https://github.com/marketplace/actions/build-and-push-docker-images).  
 * This job create a docker image with image tag using branch name and short SHA of commit for example ```feature/test_5e38e33```
