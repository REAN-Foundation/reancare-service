import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CommunicationController } from './communication.controller';
import { CommunicationAuth } from './communication.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CommunicationController();

    router.post('/', auth(CommunicationAuth.create), controller.create);
    router.get('/search', auth(CommunicationAuth.search), controller.search);
    router.get('/:id', auth(CommunicationAuth.getById), controller.getById);
    router.put('/:id', auth(CommunicationAuth.update), controller.update);
    router.delete('/:id', auth(CommunicationAuth.delete), controller.delete);

    app.use('/api/v1/clinical/donation-communication', router);
};
