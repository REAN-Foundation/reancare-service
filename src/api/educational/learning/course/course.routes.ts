import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CourseController } from './course.controller';
import { CourseAuth } from './course.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CourseController();

    router.post('/', auth(CourseAuth.create), controller.create);
    router.get('/search', auth(CourseAuth.search), controller.search);
    router.get('/:id', auth(CourseAuth.getById), controller.getById);
    router.put('/:id', auth(CourseAuth.update), controller.update);
    router.delete('/:id', auth(CourseAuth.delete), controller.delete);

    app.use('/api/v1/educational/courses', router);
};
