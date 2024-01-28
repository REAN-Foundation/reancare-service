import express from 'express';
import { TenantController } from './tenant.controller';
import { auth } from '../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TenantController();
    
    router.post('/', auth('Tenant.Tenants.Create'), controller.create);
    router.get('/search', auth('Tenant.Tenants.Search'), controller.search);
    router.put('/:id', auth('Tenant.Tenants.Update'), controller.update);
    router.delete('/:id', auth('Tenant.Tenants.Delete'), controller.delete);

    router.post('/:id/promote-as-admin', auth('Tenant.Tenants.PromoteTenantUserAsAdmin'), controller.promoteTenantUserAsAdmin);
    router.post('/:id/demote-as-admin', auth('Tenant.Tenants.DemoteAdmin'), controller.demoteAdmin);

    router.get('/:id/stats', auth('Tenant.Tenants.GetTenantStats'), controller.getTenantStats);
    router.get('/:id/admins', auth('Tenant.Tenants.GetTenantAdmins'), controller.getTenantAdmins);
    router.get('/:id/regular-users', auth('Tenant.Tenants.GetTenantRegularUsers'), controller.getTenantRegularUsers);

    router.get('/:id', auth('Tenant.Tenants.GetById'), controller.getById);

    app.use('/api/v1/tenants', router);
};
