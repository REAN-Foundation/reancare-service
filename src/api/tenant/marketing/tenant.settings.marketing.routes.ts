import express from 'express';
import { TenantSettingsMarketingController } from './tenant.settings.marketing.controller';
import { auth } from '../../../auth/auth.handler';
import { TenantSettingsMarketingAuth } from './tenant.settings.marketing.auth';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TenantSettingsMarketingController();

    router.get('/by-code/:tenantCode', auth(TenantSettingsMarketingAuth.getByTenant), controller.getByCode);
    router.get('/:tenantId', auth(TenantSettingsMarketingAuth.getByTenant), controller.getByTenant);
    router.post('/:tenantId', auth(TenantSettingsMarketingAuth.create), controller.create);
    router.get('/:tenantId/download', auth(TenantSettingsMarketingAuth.downloadPdf), controller.downloadPdf);
    router.put('/:tenantId', auth(TenantSettingsMarketingAuth.updateAll), controller.updateAll);
    router.put('/:tenantId/images', auth(TenantSettingsMarketingAuth.updateImages), controller.updateImages);
    router.put('/:tenantId/logos', auth(TenantSettingsMarketingAuth.updateLogos), controller.updateLogos);
    router.put('/:tenantId/qrcode', auth(TenantSettingsMarketingAuth.updateQRcode), controller.updateQRcode);
    router.put('/:tenantId/content', auth(TenantSettingsMarketingAuth.updateContent), controller.updateContent);
    router.delete('/:tenantId', auth(TenantSettingsMarketingAuth.delete), controller.delete);

    app.use('/api/v1/tenant-settings-marketing', router);
};


