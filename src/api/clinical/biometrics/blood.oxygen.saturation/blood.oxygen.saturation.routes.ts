/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodOxygenSaturationController } from './blood.oxygen.saturation.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodOxygenSaturationController();

    router.post('/', auth('Clinical.Biometrics.BloodOxygenSaturation.Create'), controller.create);
    router.get('/search', auth('Clinical.Biometrics.BloodOxygenSaturation.Search'), controller.search);
    router.get('/:id', auth('Clinical.Biometrics.BloodOxygenSaturation.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Biometrics.BloodOxygenSaturation.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Biometrics.BloodOxygenSaturation.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-oxygen-saturations', router);
};
