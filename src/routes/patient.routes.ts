import express from 'express';
import { PatientController } from '../controllers/patient.controller';
import { Loader } from '../startup/loader';


export default (app: express.Application) => {

    const router = require('express').Router();
    const authenticator = Loader.authenticator;
    const authorizer = Loader.authorizer;
    const controller = new PatientController();

    //Note:
    //For user controller, there will not be end-points for create, update and delete.
    //User will not be directly created/updated/deleted, but through user type specific
    //entity controllers such patient, doctor, etc.

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByUserId);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.put('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateByUserId);
    
    app.use('/api/v1/user', router);
};
