import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CourseContentController } from './course.content.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CourseContentController();

    router.post('/', auth(), controller.create);
    router.get('/by-course/:courseId', auth(), controller.getContentsForCourse);
    router.get('/by-learning-path/:learningPathId', auth(), controller.getContentsForLearningPath);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/educational/course-contents', router);
};
