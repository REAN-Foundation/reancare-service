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

    router.get('/by-phone/:phone/role/:roleId', controller.getByPhoneAndRole);
    router.get('/by-email/:email/role/:roleId', controller.getByEmailAndRole);
    router.get('/:id/tenants', controller.getTenantsForUser);
    router.get('/:id', authenticator.authenticateUser, controller.getById);

    //router.get('/search', authenticator.authenticateUser, controller.search);
    router.post('/login-with-password', controller.loginWithPassword);

    //router.post('/reset-password', controller.resetPassword);
    router.post('/generate-otp', controller.generateOtp);
    router.post('/login-with-otp', controller.loginWithOtp);
    router.post('/logout', authenticator.authenticateUser, controller.logout);

    router.post('/access-token/:refreshToken', controller.rotateUserAccessToken);
    router.post('/', controller.create);

    app.use('/api/v1/users', router);
};
