import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { KnowledgeNuggetController } from './knowledge.nugget.controller';
import { KnowledgeNuggetAuth } from './knowledge.nugget.auth';

//////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new KnowledgeNuggetController();

    router.get("/today/:patientUserId", auth(KnowledgeNuggetAuth.getTodaysTopic), controller.getTodaysTopic);
    router.post('/', auth(KnowledgeNuggetAuth.create), controller.create);
    router.get('/search', auth(KnowledgeNuggetAuth.search), controller.search);
    router.get('/:id', auth(KnowledgeNuggetAuth.getById), controller.getById);
    router.put('/:id', auth(KnowledgeNuggetAuth.update), controller.update);
    router.delete('/:id', auth(KnowledgeNuggetAuth.delete), controller.delete);

    app.use('/api/v1/educational/knowledge-nuggets', router);
};
