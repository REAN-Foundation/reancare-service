import express from 'express';
import { ApiClientController } from '../controllers/api.client.controller';
import { Loader } from '../startup/loader';


export const register = (app: express.Application) => {

    const router = require('express').Router();
    const authenticator = Loader.authenticator;
    const authorizer = Loader.authorizer;
    const controller = new ApiClientController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    router.get('/:clientCode/apiKey', controller.getApiKey);

    app.use('/api/v1/user', router);
};

