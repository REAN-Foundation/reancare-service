import express from 'express';
import { TenantController } from './tenant.controller';
import { Loader } from '../../startup/loader';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new TenantController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    router.post('/:id/add-user-as-admin', authenticator.authenticateUser, controller.addUserAsAdminToTenant);
    router.post('/:id/remove-user-as-admin', authenticator.authenticateUser, controller.removeUserAsAdminFromTenant);
    router.post('/:id/add-user-as-moderator', authenticator.authenticateUser, controller.addUserAsModeratorToTenant);
    router.post('/:id/remove-user-as-moderator', authenticator.authenticateUser, controller.removeUserAsModeratorFromTenant);

    router.get('/:id/stats', authenticator.authenticateUser, controller.getTenantStats);
    router.get('/:id/admins', authenticator.authenticateUser, controller.getTenantAdmins);
    router.get('/:id/moderators', authenticator.authenticateUser, controller.getTenantModerators);

    router.get('/:id', authenticator.authenticateUser, controller.getById);

    app.use('/api/v1/tenants', router);
};
