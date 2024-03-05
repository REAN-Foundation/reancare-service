import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CourseModuleController } from './course.module.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CourseModuleController();

    router.post('/', auth('Educational.CourseModule.Create'), controller.create);
    router.get('/search', auth('Educational.CourseModule.Search'), controller.search);
    router.get('/:id', auth('Educational.CourseModule.GetById'), controller.getById);
    router.put('/:id', auth('Educational.CourseModule.Update'), controller.update);
    router.delete('/:id', auth('Educational.CourseModule.Delete'), controller.delete);

    app.use('/api/v1/educational/course-modules', router);
};
