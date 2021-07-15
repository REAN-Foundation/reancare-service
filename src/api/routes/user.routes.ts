import express from 'express';
import { UserController } from '../controllers/user.controller';
import { Loader } from '../../startup/loader';


export const register = (app: express.Application) => {

    const router = require('express').Router();
    const authenticator = Loader.authenticator;
    const authorizer = Loader.authorizer;
    const controller = new UserController();

    //Note:
    //For user controller, there will not be end-points for create, update and delete.
    //User will not be directly created/updated/deleted, but through user type specific
    //entity controllers such patient, doctor, etc.

    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    //router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.post('/login-with-password', authenticator.authenticateClient, controller.loginWithPassword);
    //router.post('/reset-password', authenticator.authenticateClient, controller.resetPassword);
    router.post('/generate-otp', authenticator.authenticateClient, controller.generateOtp);
    router.post('/login-with-otp', authenticator.authenticateClient, controller.loginWithOtp);

    app.use('/api/v1/user', router);
};

