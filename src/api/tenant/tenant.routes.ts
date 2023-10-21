import express from 'express';
import { TenantController } from './tenant.controller';
import { auth } from '../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TenantController();

    router.post('/', auth('Tenant.Create'), controller.create);
    router.get('/search', auth('Tenant.Search'), controller.search);
    router.put('/:id', auth('Tenant.Update'), controller.update);
    router.delete('/:id', auth('Tenant.Delete'), controller.delete);

    router.post('/:id/promote-as-admin', auth('Tenant.PromoteTenantUserAsAdmin'), controller.promoteTenantUserAsAdmin);
    router.post('/:id/demote-as-admin', auth('Tenant.DemoteAdmin'), controller.demoteAdmin);

    router.get('/:id/stats', auth('Tenant.GetTenantStats'), controller.getTenantStats);
    router.get('/:id/admins', auth('Tenant.GetTenantAdmins'), controller.getTenantAdmins);
    router.get('/:id/regular-users', auth('Tenant.GetTenantRegularUsers'), controller.getTenantRegularUsers);

    router.get('/:id', auth('Tenant.GetById'), controller.getById);

    app.use('/api/v1/tenants', router);
};
