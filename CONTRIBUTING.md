# Contributing to this repository <!-- omit in toc -->

## Getting started <!-- omit in toc -->

Before you begin:
- Check the [technology stack](docs/development.md#technology-stack).
- Have you read the [code of conduct](CODE_OF_CONDUCT.md)?
- Check the [different ways](#Various-ways-to-contribute) you can contribute.
- Check out the [existing issues](https://github.com/REAN-Foundation/reancare-service/issues).

**Learn more about contributing:**

## Various ways to contribute

  [Types of contributions :memo:](#types-of-contributions-memo)

  You can contribute to the repo by - 
  1. Testing the repository and add additional test cases.
  2. Raising an [issue here](https://github.com/REAN-Foundation/reancare-service/issues)- for a problem you have encountered or for a new feature request.
  3. Fixing the bug or implementing a new feature/part of the feature
  4. Adding Postman requests and test cases.
  5. Documentation and transaltion. REANCare service API is currently documented through Postman as a part of collection.
  6. Spreading the word!

  - [:beetle: Add an issue](#beetle-issues)
    - Issues are used to track the tasks. If you find any problem, a behaviour to be updated, or a new feature to be added, search the issue list if it already has been reported by somebody else. If not, open the issue using the template. You can track the progress on the issue or the discuss details in the conversation.
  
  - [:hammer_and_wrench: Fix the bug/Implement a feature/Create Pull requests](#hammer_and_wrench-pull-requests)
    - If you find any open issues which you think you can contribute to, pick the issue. 
    - Create a new branch and clone the repository. you can also fork the repo. See [here](docs/development.md) to see how to set-up development environment on your local machine.
    - Start working on the issue on your machine. 
    - Once the issue is resolved locally or a new feature is implemented, test it locally. 
    - Perform a self review. Here is the checklist for the self-review.
      - [ ] Pull the latest from the branch against into you are going to merge the coide.
      - [ ] Confirm the changes meet the resolution criteria and nothing else.
      - [ ] Do not try to solve multiple major issues through a single pull request.
      - [ ] Make sure you have all the tests locally to check that you have not introduced any new regression.
      - [ ] You following coding and styling guidelines.
      - [ ] Make sure that you change is not overly complex, unreadable and unnecessarily smart. Simplicity wins!
      - [ ] Make sure the comments are not too verbose and not to cryptic.
      - [ ] If there are any failing tests, fix them first.
      - [ ] If there are database schema changes, please make sure that incremental schema changes/migrations are tested locally.
      - [ ] Make sure you have updated -
        - [ ] Documentation if necessary
        - [ ] Tests/test data if necessary
        - [ ] Postman collection if necessary
        - [ ] Version if necessary
        - [ ] Grammer if necessary
      - [ ] Make sure the code metrics are not deteriorated
    - Once satisfied, create a pull request. 
    - Fill out all the fields in the pull request as per the template. This will help the reviewers to understand your changes.
    - If the reviewer suggests some changes and asks for the clarification, you have to complete those changes.
    - Once the review is satisfactory, the reviewer will merge your changes. If there are again some merge conflicts, you have to resolve those merge conflicts first locally and again pushing your changes to your branch/repo.

  - [:memo: Documenting the API](#hammer_and_wrench-pull-requests)
  If you feel that there is a need to update the documentation, open the Postman collection on your machine, update the documentation and save the Postman collection to postman folder.
