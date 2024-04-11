import express from 'express';
import { UserController } from './user.controller';
import { auth } from '../../../auth/auth.handler';
import { UserAuth } from './user.auth';

////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserController();

    router.get('/by-phone/:phone/role/:roleId',
        auth(UserAuth.getUserByRoleAndPhone), controller.getTenantUserByRoleAndPhone);

    router.get('/by-email/:email/role/:roleId',
        auth(UserAuth.getUserByRoleAndEmail), controller.getTenantUserByRoleAndEmail);

    router.get('/tenants/:tenantId/roles/:roleId/phones/:phone',
        auth(UserAuth.getTenantUserByRoleAndPhone), controller.getTenantUserByRoleAndPhone);
        
    router.get('/tenants/:tenantId/roles/:roleId/emails/:email',
        auth(UserAuth.getTenantUserByRoleAndEmail), controller.getTenantUserByRoleAndEmail);

    router.get('/:phone/tenants', auth(UserAuth.getTenantsForUserWithPhone), controller.getTenantsForUserWithPhone);
    router.get('/:email/tenants', auth(UserAuth.getTenantsForUserWithEmail), controller.getTenantsForUserWithEmail);
    router.get('/:id', auth(UserAuth.getById), controller.getById);

    //router.get('/search', auth(UserAuth.search), controller.search);
    router.post('/login-with-password', auth(UserAuth.loginWithPassword), controller.loginWithPassword);

    //router.post('/reset-password', auth(UserAuth.resetPassword), controller.resetPassword);
    router.post('/generate-otp', auth(UserAuth.generateOtp), controller.generateOtp);
    router.post('/login-with-otp', auth(UserAuth.loginWithOtp), controller.loginWithOtp);
    router.post('/logout', auth(UserAuth.logout), controller.logout);

    router.post('/access-token/:refreshToken', auth(UserAuth.rotateUserAccessToken), controller.rotateUserAccessToken);
    router.post('/', auth(UserAuth.create), controller.create);

    app.use('/api/v1/users', router);
};
