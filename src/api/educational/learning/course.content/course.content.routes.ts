import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CourseContentController } from './course.content.controller';
import { CourseContentAuth } from './course.content.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CourseContentController();

    router.post('/', auth(CourseContentAuth.create), controller.create);
    router.get('/by-course/:courseId', auth(CourseContentAuth.getContentsForCourse), controller.getContentsForCourse);
    router.get('/by-learning-path/:learningPathId', auth(CourseContentAuth.getContentsForLearningPath), controller.getContentsForLearningPath);
    router.get('/search', auth(CourseContentAuth.search), controller.search);
    router.get('/:id', auth(CourseContentAuth.getById), controller.getById);
    router.put('/:id', auth(CourseContentAuth.update), controller.update);
    router.delete('/:id', auth(CourseContentAuth.delete), controller.delete);

    app.use('/api/v1/educational/course-contents', router);
};
