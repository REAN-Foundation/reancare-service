import express from 'express';
import { Loader } from '../../../startup/loader';
import { UserController } from './user.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserController();

    //Note:
    //For user controller, there will not be end-points for create, update and delete.
    //User will not be directly created/updated/deleted, but through user type specific
    //entity controllers such patient, doctor, etc.

    router.get('/by-phone/:phone/role/:roleId', authenticator.authenticateClient, controller.getByPhoneAndRole);
    router.get('/by-email/:email/role/:roleId', authenticator.authenticateClient, controller.getByEmailAndRole);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);

    //router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.post('/login-with-password', authenticator.authenticateClient, controller.loginWithPassword);

    //router.post('/reset-password', authenticator.authenticateClient, controller.resetPassword);
    router.post('/generate-otp', authenticator.authenticateClient, controller.generateOtp);
    router.post('/login-with-otp', authenticator.authenticateClient, controller.loginWithOtp);
    router.post('/logout', authenticator.authenticateClient, authenticator.authenticateUser, controller.logout);

    router.post('/access-token/:refreshToken', authenticator.authenticateClient, controller.rotateUserAccessToken);

    app.use('/api/v1/users', router);
};
