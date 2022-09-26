import express from 'express';
import { Loader } from '../../../../startup/loader';
import { CourseContentController } from './course.content.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CourseContentController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/by-course/:courseId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getContentsForCourse);
    router.get('/by-learning-path/:learningPathId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getContentsForLearningPath);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/educational/course-contents', router);
};
