import express from 'express';
import { TenantController } from './tenant.controller';
import { auth } from '../../../auth/auth.handler';
import { TenantAuth } from './tenant.auth';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TenantController();

    router.post('/', auth(TenantAuth.create), controller.create);
    router.get('/search', auth(TenantAuth.search), controller.search);
    router.get('/active', auth(TenantAuth.getActiveTenants), controller.getActiveTenants);
    router.put('/:id', auth(TenantAuth.update), controller.update);
    router.delete('/:id', auth(TenantAuth.delete), controller.delete);

    router.post('/:id/promote-as-admin', auth(TenantAuth.promoteTenantUserAsAdmin), controller.promoteTenantUserAsAdmin);
    router.post('/:id/demote-as-admin', auth(TenantAuth.demoteAdmin), controller.demoteAdmin);

    router.post('/:id/settings/database/create-bot-schema', auth(TenantAuth.createBotSchema), controller.createBotSchema);

    router.post('/:id/settings/secret/create-secret', auth(TenantAuth.createSecret), controller.createSecret);
    router.get('/:id/settings/secret/', auth(TenantAuth.getSecret), controller.getSecret);
    router.get('/settings/secret/:tenantCode', auth(TenantAuth.getSecretByCode), controller.getSecretByCode);
    router.put('/:id/settings/secret/', auth(TenantAuth.updateSecret), controller.updateSecret);

    router.get('/:id/stats', auth(TenantAuth.getTenantStats), controller.getTenantStats);
    router.get('/:id/admins', auth(TenantAuth.getTenantAdmins), controller.getTenantAdmins);
    router.get('/:id/regular-users', auth(TenantAuth.getTenantRegularUsers), controller.getTenantRegularUsers);

    router.get('/:id', auth(TenantAuth.getById), controller.getById);

    app.use('/api/v1/tenants', router);
};
