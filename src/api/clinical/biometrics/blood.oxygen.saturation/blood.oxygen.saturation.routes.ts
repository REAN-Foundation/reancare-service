/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodOxygenSaturationController } from './blood.oxygen.saturation.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodOxygenSaturationController();

    router.post('/', auth('Biometrics.BloodOxygenSaturation.Create'), controller.create);
    router.get('/search', auth('Biometrics.BloodOxygenSaturation.Search'), controller.search);
    router.get('/:id', auth('Biometrics.BloodOxygenSaturation.GetById'), controller.getById);
    router.put('/:id', auth('Biometrics.BloodOxygenSaturation.Update'), controller.update);
    router.delete('/:id', auth('Biometrics.BloodOxygenSaturation.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-oxygen-saturations', router);
};
