/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodOxygenSaturationController } from './blood.oxygen.saturation.controller';
import { BloodOxygenSaturationAuth } from './blood.oxygen.saturation.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodOxygenSaturationController();

    router.post('/', auth(BloodOxygenSaturationAuth.create), controller.create);
    router.get('/search', auth(BloodOxygenSaturationAuth.search), controller.search);
    router.get('/:id', auth(BloodOxygenSaturationAuth.getById), controller.getById);
    router.put('/:id', auth(BloodOxygenSaturationAuth.update), controller.update);
    router.delete('/:id', auth(BloodOxygenSaturationAuth.delete), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-oxygen-saturations', router);
};
