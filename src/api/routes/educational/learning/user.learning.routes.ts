import express from 'express';
import { Loader } from '../../../../startup/loader';
import { UserLearningController } from '../../../controllers/educational/learning/user.learning.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserLearningController();

    router.post('/:userId/contents/:contentId/update-learning', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateUserLearning);

    router.get('/:userId/learning-paths/:learningPathId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getLearningPathProgress);
    router.get('/:userId/courses/:courseId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getCourseProgress);
    router.get('/:userId/modules/:moduleId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getModuleProgress);
    router.get('/:userId/contents/:contentId/progress', authenticator.authenticateClient, authenticator.authenticateUser, controller.getContentProgress);

    app.use('/api/v1/educational/user-learnings', router);

};
