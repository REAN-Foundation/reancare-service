import express from 'express';
import { TenantSettingsController } from './tenant.settings.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TenantSettingsController();

    router.get('/types', auth('Tenant.Settings.GetTenantSettingsTypes', true), controller.getTenantSettingsTypes);
    router.get('/:id/types/:settingsType', auth('Tenant.Settings.GetTenantSettingsByType'), controller.getTenantSettingsByType);
    router.get('/:id', auth('Tenant.Settings.GetTenantSettings'), controller.getTenantSettings);
    router.put('/:id/types/:settingsType', auth('Tenant.Settings.UpdateTenantSettingsByType'), controller.updateTenantSettingsByType);
    router.put('/:id', auth('Tenant.Settings.UpdateTenantSettings'), controller.updateTenantSettings);

    app.use('/api/v1/tenant-settings', router);
};
