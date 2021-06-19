import express from 'express';
import { ClientController } from '../controllers/client.controller';
import { Loader } from '../startup/loader';


export const register = (app: express.Application) => {

    const router = require('express').Router();
    const authenticator = Loader.authenticator;
    const authorizer = Loader.authorizer;
    const controller = new ClientController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.get('/:id/secrets', authenticator.authenticateUser, controller.getSecrets);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/user', router);
};

