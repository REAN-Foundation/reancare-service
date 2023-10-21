import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { LearningPathController } from './learning.path.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new LearningPathController();

    router.post('/', auth('LearningPath.Create'), controller.create);
    router.get('/search', auth('LearningPath.Search'), controller.search);
    router.get('/:id', auth('LearningPath.GetById'), controller.getById);
    router.put('/:id', auth('LearningPath.Update'), controller.update);
    router.delete('/:id', auth('LearningPath.Delete'), controller.delete);

    app.use('/api/v1/educational/learning-paths', router);
};
