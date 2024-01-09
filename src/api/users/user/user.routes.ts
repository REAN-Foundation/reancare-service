import express from 'express';
import { UserController } from './user.controller';
import { auth } from '../../../auth/auth.handler';

////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserController();

    router.get('/by-phone/:phone/role/:roleId',
        auth('User.User.GetTenantUserByRoleAndPhone', false), controller.getTenantUserByRoleAndPhone);
    router.get('/by-email/:email/role/:roleId',
        auth('User.User.GetTenantUserByRoleAndPhone', true), controller.getTenantUserByRoleAndEmail);

    router.get('/tenants/:tenantId/roles/:roleId/phones/:phone',
        auth('User.User.GetTenantUserByRoleAndPhone', true), controller.getTenantUserByRoleAndPhone);
    router.get('/tenants/:tenantId/roles/:roleId/emails/:email',
        auth('User.User.GetTenantUserByRoleAndEmail', true), controller.getTenantUserByRoleAndEmail);

    router.get('/:phone/tenants', auth('User.User.GetTenantsForUserWithPhone', true), controller.getTenantsForUserWithPhone);
    router.get('/:email/tenants', auth('User.User.GetTenantsForUserWithEmail', true), controller.getTenantsForUserWithEmail);
    router.get('/:id', auth('User.User.GetById'), controller.getById);

    //router.get('/search', auth('User.User.Search'), controller.search);
    router.post('/login-with-password', auth('User.User.LoginWithPassword', true), controller.loginWithPassword);

    //router.post('/reset-password', auth('User.User.ResetPassword', true), controller.resetPassword);
    router.post('/generate-otp', auth('User.User.GenerateOtp', true), controller.generateOtp);
    router.post('/login-with-otp', auth('User.User.LoginWithOtp', true), controller.loginWithOtp);
    router.post('/logout', auth('User.User.Logout'), controller.logout);

    router.post('/access-token/:refreshToken', auth('User.User.RotateUserAccessToken', true), controller.rotateUserAccessToken);
    router.post('/', auth('User.User.Create', true), controller.create);

    app.use('/api/v1/users', router);
};
