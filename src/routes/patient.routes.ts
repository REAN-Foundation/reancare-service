import express from 'express';
import { PatientController } from '../controllers/patient.controller';
import { Loader } from '../startup/loader';


export const register = (app: express.Application) => {

    const router = require('express').Router();
    const authenticator = Loader.authenticator;
    const authorizer = Loader.authorizer;
    const controller = new PatientController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByUserId);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.put('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateByUserId);
    
    app.use('/api/v1/user', router);
};
