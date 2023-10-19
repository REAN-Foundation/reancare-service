import express from 'express';
import { TenantController } from './tenant.controller';
import { auth } from '../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TenantController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    router.post('/:id/promote-as-admin', auth(), controller.promoteTenantUserAsAdmin);
    router.post('/:id/demote-as-admin', auth(), controller.demoteAdmin);

    router.get('/:id/stats', auth(), controller.getTenantStats);
    router.get('/:id/admins', auth(), controller.getTenantAdmins);
    router.get('/:id/regular-users', auth(), controller.getTenantRegularUsers);

    router.get('/:id', auth(), controller.getById);

    app.use('/api/v1/tenants', router);
};
