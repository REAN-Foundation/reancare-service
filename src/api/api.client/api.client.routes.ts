import express from 'express';
import { ApiClientController } from './api.client.controller';
import { Loader } from '../../startup/loader';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ApiClientController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    router.get('/:clientCode/current-api-key', controller.getCurrentApiKey);
    router.put('/:clientCode/renew-api-key', controller.renewApiKey);

    app.use('/api/v1/api-clients', router);
};

