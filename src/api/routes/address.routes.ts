import express from 'express';
import { AddressController } from '../controllers/address.controller';
import { Loader } from '../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application) => {

    const router = require('express').Router();
    const authenticator = Loader.authenticator;
    const authorizer = Loader.authorizer;
    const controller = new AddressController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    
    app.use('/api/v1/addresses', router);
};
