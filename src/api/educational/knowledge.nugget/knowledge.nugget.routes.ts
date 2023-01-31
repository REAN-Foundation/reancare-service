import express from 'express';
import { Loader } from '../../../startup/loader';
import { KnowledgeNuggetController } from './knowledge.nugget.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new KnowledgeNuggetController();

    router.get("/today/:patientUserId", authenticator.authenticateClient, authenticator.authenticateUser, controller.getTodaysTopic);
    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/educational/knowledge-nuggets', router);
};
