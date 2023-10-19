import express from 'express';
import { ClientAppController } from './client.app.controller';
import { auth } from '../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ClientAppController();

    router.post('/', auth('Client.Create'), controller.create);
    router.get('/search', auth('Client.Search'), controller.search);
    router.get('/:id', auth('Client.GetById'), controller.getById);
    router.put('/:id', auth('Client.Update'), controller.update);
    router.delete('/:id', auth('Client.Delete'), controller.delete);

    router.get('/:clientCode/current-api-key', controller.getCurrentApiKey);
    router.put('/:clientCode/renew-api-key', controller.renewApiKey);

    app.use('/api/v1/api-clients', router);
};

