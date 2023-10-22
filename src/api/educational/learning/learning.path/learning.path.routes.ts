import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { LearningPathController } from './learning.path.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new LearningPathController();

    router.post('/', auth('Educational.LearningPath.Create'), controller.create);
    router.get('/search', auth('Educational.LearningPath.Search'), controller.search);
    router.get('/:id', auth('Educational.LearningPath.GetById'), controller.getById);
    router.put('/:id', auth('Educational.LearningPath.Update'), controller.update);
    router.delete('/:id', auth('Educational.LearningPath.Delete'), controller.delete);

    app.use('/api/v1/educational/learning-paths', router);
};
