import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { KnowledgeNuggetController } from './knowledge.nugget.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new KnowledgeNuggetController();

    router.get("/today/:patientUserId", auth('KnowledgeNugget.GetTodaysTopic'), controller.getTodaysTopic);
    router.post('/', auth('KnowledgeNugget.Create'), controller.create);
    router.get('/search', auth('KnowledgeNugget.Search'), controller.search);
    router.get('/:id', auth('KnowledgeNugget.GetById'), controller.getById);
    router.put('/:id', auth('KnowledgeNugget.Update'), controller.update);
    router.delete('/:id', auth('KnowledgeNugget.Delete'), controller.delete);

    app.use('/api/v1/educational/knowledge-nuggets', router);
};
