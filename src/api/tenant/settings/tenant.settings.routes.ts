import express from 'express';
import { TenantSettingsController } from './tenant.settings.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TenantSettingsController();

    router.get('/types', auth('Tenant.Settings.GetTenantSettingsTypes'), controller.getTenantSettingsTypes);
    router.get('/:tenantId/types/:settingsType', auth('Tenant.Settings.GetTenantSettingsByType'), controller.getTenantSettingsByType);
    router.get('/:tenantId', auth('Tenant.Settings.GetTenantSettings'), controller.getTenantSettings);
    router.put('/:tenantId/types/:settingsType', auth('Tenant.Settings.UpdateTenantSettingsByType'), controller.updateTenantSettingsByType);
    router.put('/:tenantId', auth('Tenant.UpdateTenantSettings'), controller.updateTenantSettings);

    app.use('/api/v1/tenant-settings', router);
};
