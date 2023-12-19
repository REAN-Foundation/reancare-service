import express from 'express';
import { UserController } from './user.controller';
import { auth } from '../../../auth/auth.handler';

////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserController();

    router.get('/by-phone/:phone/role/:roleId',
        auth('Users.User.GetTenantUserByRoleAndPhone', false), controller.getTenantUserByRoleAndPhone);
    router.get('/by-email/:email/role/:roleId',
        auth('Users.User.GetTenantUserByRoleAndPhone', true), controller.getTenantUserByRoleAndEmail);

    router.get('/tenants/:tenantId/roles/:roleId/phones/:phone',
        auth('Users.User.GetTenantUserByRoleAndPhone', true), controller.getTenantUserByRoleAndPhone);
    router.get('/tenants/:tenantId/roles/:roleId/emails/:email',
        auth('Users.User.GetTenantUserByRoleAndEmail', true), controller.getTenantUserByRoleAndEmail);

    router.get('/:phone/tenants', auth('Users.User.GetTenantsForUserWithPhone', true), controller.getTenantsForUserWithPhone);
    router.get('/:email/tenants', auth('Users.User.GetTenantsForUserWithEmail', true), controller.getTenantsForUserWithEmail);
    router.get('/:id', auth('Users.User.GetById'), controller.getById);

    //router.get('/search', auth('Users.User.Search'), controller.search);
    router.post('/login-with-password', auth('Users.User.LoginWithPassword', true), controller.loginWithPassword);

    //router.post('/reset-password', auth('Users.User.ResetPassword', true), controller.resetPassword);
    router.post('/generate-otp', auth('Users.User.GenerateOtp', true), controller.generateOtp);
    router.post('/login-with-otp', auth('Users.User.LoginWithOtp', true), controller.loginWithOtp);
    router.post('/logout', auth('Users.User.Logout'), controller.logout);

    router.post('/access-token/:refreshToken', auth('Users.User.RotateUserAccessToken', true), controller.rotateUserAccessToken);
    router.post('/', auth('Users.User.Create', true), controller.create);

    app.use('/api/v1/users', router);
};
