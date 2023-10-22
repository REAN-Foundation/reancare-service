import express from 'express';
import { ClientAppController } from './client.app.controller';
import { auth } from '../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ClientAppController();

    router.post('/', auth('ClientApp.Create'), controller.create);
    router.get('/search', auth('ClientApp.Search'), controller.search);
    router.get('/:id', auth('ClientApp.GetById'), controller.getById);
    router.put('/:id', auth('ClientApp.Update'), controller.update);
    router.delete('/:id', auth('ClientApp.Delete'), controller.delete);

    router.get('/:clientCode/current-api-key', auth('ClientApp.GetCurrentApiKey'), controller.getCurrentApiKey);
    router.put('/:clientCode/renew-api-key', auth('ClientApp.RenewApiKey'), controller.renewApiKey);

    app.use('/api/v1/api-clients', router);
};

