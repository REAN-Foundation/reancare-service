import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { UserLearningController } from './user.learning.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserLearningController();

    router.put('/:userId/contents/:contentId', auth(), controller.updateUserLearning);

    router.get('/:userId/learning-paths', auth(), controller.getUserLearningPaths);
    router.get('/:userId/course-contents', auth(), controller.getUserCourseContents);

    router.get('/:userId/learning-paths/:learningPathId/progress', auth(), controller.getLearningPathProgress);
    router.get('/:userId/courses/:courseId/progress', auth(), controller.getCourseProgress);
    router.get('/:userId/modules/:moduleId/progress', auth(), controller.getModuleProgress);
    router.get('/:userId/contents/:contentId/progress', auth(), controller.getContentProgress);

    app.use('/api/v1/educational/user-learnings', router);

};
