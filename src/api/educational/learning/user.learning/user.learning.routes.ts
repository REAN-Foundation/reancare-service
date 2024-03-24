import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { UserLearningController } from './user.learning.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserLearningController();

    router.put('/:userId/contents/:contentId', auth('Educational.UserLearning.UpdateUserLearning'), controller.updateUserLearning);

    router.get('/:userId/learning-paths', auth('Educational.UserLearning.GetUserLearningPaths'), controller.getUserLearningPaths);
    router.get('/:userId/course-contents', auth('Educational.UserLearning.GetUserCourseContents'), controller.getUserCourseContents);

    router.get('/:userId/learning-paths/:learningPathId/progress', auth('Educational.UserLearning.GetLearningPathProgress'), controller.getLearningPathProgress);
    router.get('/:userId/courses/:courseId/progress', auth('Educational.UserLearning.GetCourseProgress'), controller.getCourseProgress);
    router.get('/:userId/modules/:moduleId/progress', auth('Educational.UserLearning.GetModuleProgress'), controller.getModuleProgress);
    router.get('/:userId/contents/:contentId/progress', auth('Educational.UserLearning.GetContentProgress'), controller.getContentProgress);

    app.use('/api/v1/educational/user-learnings', router);

};
