/* eslint-disable max-len */
import express from 'express';
import { Loader } from '../../../../startup/loader';
import { BloodOxygenSaturationController } from './blood.oxygen.saturation.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new BloodOxygenSaturationController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-oxygen-saturations', router);
};
