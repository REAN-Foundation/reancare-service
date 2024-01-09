import express from 'express';
import { TenantFeatureSettingController } from '../feature.setting/tenant.feature.setting.controller';
import { Loader } from '../../../startup/loader';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new TenantFeatureSettingController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);
    router.get('/:id', authenticator.authenticateUser, controller.getById);

    app.use('/api/v1/tenant-feature-setting', router);
};
