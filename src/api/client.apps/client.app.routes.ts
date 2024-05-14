import express from 'express';
import { ClientAppController } from './client.app.controller';
import { auth } from '../../auth/auth.handler';
import { ClientAppAuth } from './client.app.auth';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ClientAppController();

    router.post('/', auth(ClientAppAuth.create), controller.create);
    router.get('/search', auth(ClientAppAuth.search), controller.search);
    router.get('/:id', auth(ClientAppAuth.getById), controller.getById);
    router.put('/:id', auth(ClientAppAuth.update), controller.update);
    router.delete('/:id', auth(ClientAppAuth.delete), controller.delete);

    router.get('/:clientCode/current-api-key', auth(ClientAppAuth.getCurrentApiKey), controller.getCurrentApiKey);
    router.put('/:clientCode/renew-api-key', auth(ClientAppAuth.renewApiKey), controller.renewApiKey);

    app.use('/api/v1/api-clients', router);
};

