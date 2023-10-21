import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { UserLearningController } from './user.learning.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserLearningController();

    router.put('/:userId/contents/:contentId', auth('UserLearning.UpdateUserLearning'), controller.updateUserLearning);

    router.get('/:userId/learning-paths', auth('UserLearning.GetUserLearningPaths'), controller.getUserLearningPaths);
    router.get('/:userId/course-contents', auth('UserLearning.GetUserCourseContents'), controller.getUserCourseContents);

    router.get('/:userId/learning-paths/:learningPathId/progress', auth('UserLearning.GetLearningPathProgress'), controller.getLearningPathProgress);
    router.get('/:userId/courses/:courseId/progress', auth('UserLearning.GetCourseProgress'), controller.getCourseProgress);
    router.get('/:userId/modules/:moduleId/progress', auth('UserLearning.GetModuleProgress'), controller.getModuleProgress);
    router.get('/:userId/contents/:contentId/progress', auth('UserLearning.GetContentProgress'), controller.getContentProgress);

    app.use('/api/v1/educational/user-learnings', router);

};
