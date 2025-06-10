import express from 'express';
import { UserController } from './user.controller';
import { auth } from '../../../auth/auth.handler';
import { UserAuth } from './user.auth';

////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const controller = new UserController();

    ///////////////////////////////////////////////////////////////

    //#region Obsolete routes. Will be discontinued in future

    const obsoleteRouter = express.Router();

    obsoleteRouter.get('/by-phone/:phone/role/:roleId',
        auth(UserAuth.getUserByRoleAndPhone),
        controller.getTenantUserByRoleAndPhone);

    obsoleteRouter.get('/by-email/:email/role/:roleId',
        auth(UserAuth.getUserByRoleAndEmail),
        controller.getTenantUserByRoleAndEmail);

    obsoleteRouter.get('/tenants/:tenantId/roles/:roleId/phones/:phone',
        auth(UserAuth.getTenantUserByRoleAndPhone),
        controller.getTenantUserByRoleAndPhone);
        
    obsoleteRouter.get('/tenants/:tenantId/roles/:roleId/emails/:email',
        auth(UserAuth.getTenantUserByRoleAndEmail),
        controller.getTenantUserByRoleAndEmail);

    app.use('/api/v1/users', obsoleteRouter);

    //#endregion

    /////////////////////////////////////////////////////////////////

    const router = express.Router();

    router.get('/:phone/tenants', auth(UserAuth.getTenantsForUserWithPhone), controller.getTenantsForUserWithPhone);
    router.get('/:email/tenants', auth(UserAuth.getTenantsForUserWithEmail), controller.getTenantsForUserWithEmail);
    router.get('/search', auth(UserAuth.search), controller.search);
    router.get('/:id', auth(UserAuth.getById), controller.getById);

    router.get('/validate/:id', auth(UserAuth.validateUserById), controller.validateUserById);

    //router.get('/search', auth(UserAuth.search), controller.search);
    router.post('/login-with-password', auth(UserAuth.loginWithPassword), controller.loginWithPassword);

    router.post('/change-password', auth(UserAuth.changePassword), controller.changePassword);
    router.post('/reset-password', auth(UserAuth.resetPassword), controller.resetPassword);
    router.post('/send-password-reset-code', auth(UserAuth.sendPasswordResetCode), controller.sendPasswordResetCode);
    router.post('/generate-otp', auth(UserAuth.generateOtp), controller.generateOtp);
    router.post('/login-with-otp', auth(UserAuth.loginWithOtp), controller.loginWithOtp);
    router.post('/logout', auth(UserAuth.logout), controller.logout);

    router.post('/access-token/:refreshToken', auth(UserAuth.rotateUserAccessToken), controller.rotateUserAccessToken);
    router.post('/', auth(UserAuth.create), controller.create);
    router.put('/:id', auth(UserAuth.update), controller.update);
    router.put('/:id/profile-image', auth(UserAuth.deleteProfileImage), controller.deleteProfileImage);
    router.delete('/:id', auth(UserAuth.delete), controller.delete);

    app.use('/api/v1/users', router);

};
