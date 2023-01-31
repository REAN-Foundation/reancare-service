import express from 'express';
import { Loader } from '../../../../startup/loader';
import { UserLearningController } from './user.learning.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserLearningController();

    router.put('/:userId/contents/:contentId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateUserLearning);

    router.get('/:userId/learning-paths', authenticator.authenticateClient, authenticator.authenticateUser, controller.getUserLearningPaths);
    router.get('/:userId/course-contents', authenticator.authenticateClient, authenticator.authenticateUser, controller.getUserCourseContents);

    router.get('/:userId/learning-paths/:learningPathId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getLearningPathProgress);
    router.get('/:userId/courses/:courseId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getCourseProgress);
    router.get('/:userId/modules/:moduleId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getModuleProgress);
    router.get('/:userId/contents/:contentId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getContentProgress);

    app.use('/api/v1/educational/user-learnings', router);

};
