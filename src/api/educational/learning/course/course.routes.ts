import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CourseController } from './course.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CourseController();

    router.post('/', auth('Educational.Course.Create'), controller.create);
    router.get('/search', auth('Educational.Course.Search'), controller.search);
    router.get('/:id', auth('Educational.Course.GetById'), controller.getById);
    router.put('/:id', auth('Educational.Course.Update'), controller.update);
    router.delete('/:id', auth('Educational.Course.Delete'), controller.delete);

    app.use('/api/v1/educational/courses', router);
};
