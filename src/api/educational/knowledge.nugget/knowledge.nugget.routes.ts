import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { KnowledgeNuggetController } from './knowledge.nugget.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new KnowledgeNuggetController();

    router.get("/today/:patientUserId", auth('Educational.KnowledgeNugget.GetTodaysTopic'), controller.getTodaysTopic);
    router.post('/', auth('Educational.KnowledgeNugget.Create'), controller.create);
    router.get('/search', auth('Educational.KnowledgeNugget.Search'), controller.search);
    router.get('/:id', auth('Educational.KnowledgeNugget.GetById'), controller.getById);
    router.put('/:id', auth('Educational.KnowledgeNugget.Update'), controller.update);
    router.delete('/:id', auth('Educational.KnowledgeNugget.Delete'), controller.delete);

    app.use('/api/v1/educational/knowledge-nuggets', router);
};
