import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CourseContentController } from './course.content.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CourseContentController();

    router.post('/', auth('Educational.CourseContent.Create'), controller.create);
    router.get('/by-course/:courseId', auth('Educational.CourseContent.GetContentsForCourse'), controller.getContentsForCourse);
    router.get('/by-learning-path/:learningPathId', auth('Educational.CourseContent.GetContentsForLearningPath'), controller.getContentsForLearningPath);
    router.get('/search', auth('Educational.CourseContent.Search'), controller.search);
    router.get('/:id', auth('Educational.CourseContent.GetById'), controller.getById);
    router.put('/:id', auth('Educational.CourseContent.Update'), controller.update);
    router.delete('/:id', auth('Educational.CourseContent.Delete'), controller.delete);

    app.use('/api/v1/educational/course-contents', router);
};
