import express from 'express';
import { UserController } from './user.controller';
import { auth } from '../../../auth/auth.handler';

////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserController();

    router.get('/by-phone/:phone/role/:roleId', controller.getTenantUserByRoleAndPhone);
    router.get('/by-email/:email/role/:roleId', controller.getTenantUserByRoleAndEmail);

    router.get('/tenants/:tenantId/roles/:roleId/phones/:phone',
        auth('User.GetTenantUserByRoleAndPhone', true), controller.getTenantUserByRoleAndPhone);
    router.get('/tenants/:tenantId/roles/:roleId/emails/:email',
        auth('User.GetTenantUserByRoleAndEmail', true), controller.getTenantUserByRoleAndEmail);

    router.get('/:phone/tenants', auth('User.GetTenantsForUserWithPhone', true), controller.getTenantsForUserWithPhone);
    router.get('/:email/tenants', auth('User.GetTenantsForUserWithEmail', true), controller.getTenantsForUserWithEmail);
    router.get('/:id', auth('User.GetById'), controller.getById);

    //router.get('/search', auth('User.Search'), controller.search);
    router.post('/login-with-password', auth('User.LoginWithPassword', true), controller.loginWithPassword);

    //router.post('/reset-password', auth('User.ResetPassword', true), controller.resetPassword);
    router.post('/generate-otp', auth('User.GenerateOtp', true), controller.generateOtp);
    router.post('/login-with-otp', auth('User.LoginWithOtp', true), controller.loginWithOtp);
    router.post('/logout', auth('User.Logout'), controller.logout);

    router.post('/access-token/:refreshToken', auth('User.RotateUserAccessToken', true), controller.rotateUserAccessToken);
    router.post('/', auth('User.Create', true), controller.create);

    app.use('/api/v1/users', router);
};
