import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CourseContentController } from './course.content.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CourseContentController();

    router.post('/', auth('CourseContent.Create'), controller.create);
    router.get('/by-course/:courseId', auth('CourseContent.GetContentsForCourse'), controller.getContentsForCourse);
    router.get('/by-learning-path/:learningPathId', auth('CourseContent.GetContentsForLearningPath'), controller.getContentsForLearningPath);
    router.get('/search', auth('CourseContent.Search'), controller.search);
    router.get('/:id', auth('CourseContent.GetById'), controller.getById);
    router.put('/:id', auth('CourseContent.Update'), controller.update);
    router.delete('/:id', auth('CourseContent.Delete'), controller.delete);

    app.use('/api/v1/educational/course-contents', router);
};
