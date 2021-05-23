import express from 'express';
import { UserController } from '../controllers/user.controller';
import { Loader } from '../startup/loader';


export default (app: express.Application) => {

    const router = require('express').Router();
    const authenticator = Loader.authenticator;
    const authorizer = Loader.authorizer;
    const controller = new UserController();

    router.post(
        '',
        [
            authenticator.authenticate,
            controller.setCreateContext,
            controller.sanitizeCreate,
            authorizer.authorize,
        ],
        controller.create
    );

    // router.get('/list', [
    //     authenticator.authenticate,
    //     controller.authorizeList,
    //     controller.sanitizeList
    // ], controller.search);

    // router.get('/:id', authenticate, controller.authorize_get_by_id, controller.sanitize_get_by_id, controller.get_by_id);
    // router.get('/display-id/:displayId', authenticate, controller.authorize_get_by_id, controller.sanitize_get_by_id, controller.get_by_display_id);
    // router.put('/:id', authenticate, controller.authorize_update, controller.sanitize_update, controller.update);
    // router.delete('/:id', authenticate, controller.authorize_delete, controller.sanitize_delete, controller.delete);

    // router.post('/generate-otp', controller.generate_otp);
    // router.post('/login-otp', controller.login_with_otp);
    // router.post('/login', controller.login_with_password);
    // router.post("/change-password", authenticate, controller.authorize_change_password, controller.sanitize_change_password, controller.change_password);
    
    // router.get('/deleted', authenticate, controller.get_deleted);

    app.use('/api/v1/user', router);
};

