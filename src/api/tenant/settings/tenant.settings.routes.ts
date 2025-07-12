import express from 'express';
import { TenantSettingsController } from './tenant.settings.controller';
import { auth } from '../../../auth/auth.handler';
import { TenantSettingsAuth } from './tenant.settings.auth';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TenantSettingsController();

    router.get('/types', auth(TenantSettingsAuth.getTenantSettingsTypes), controller.getTenantSettingsTypes);
    router.get('/:tenantId/types/:settingsType', auth(TenantSettingsAuth.getTenantSettingsByType), controller.getTenantSettingsByType);
    router.get('/tenantCode/:tenantCode', auth(TenantSettingsAuth.getTenantSettingsByCode), controller.getTenantSettingsByCode);
    router.get('/:tenantId', auth(TenantSettingsAuth.getTenantSettings), controller.getTenantSettings);
    router.put('/:tenantId/types/:settingsType', auth(TenantSettingsAuth.updateTenantSettingsByType), controller.updateTenantSettingsByType);
    router.put('/:tenantId', auth(TenantSettingsAuth.updateTenantSettings), controller.updateTenantSettings);

    app.use('/api/v1/tenant-settings', router);
};
