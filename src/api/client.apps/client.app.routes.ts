import express from 'express';
import { ClientAppController } from './client.app.controller';
import { auth } from '../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ClientAppController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    router.get('/:clientCode/current-api-key', controller.getCurrentApiKey);
    router.put('/:clientCode/renew-api-key', controller.renewApiKey);

    app.use('/api/v1/api-clients', router);
};

