/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodGlucoseController } from './blood.glucose.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodGlucoseController();

    router.post('/', auth('Biometrics.BloodGlucose.Create'), controller.create);
    router.get('/search', auth('Biometrics.BloodGlucose.Search'), controller.search);
    router.get('/:id', auth('Biometrics.BloodGlucose.GetById'), controller.getById);
    router.put('/:id', auth('Biometrics.BloodGlucose.Update'), controller.update);
    router.delete('/:id', auth('Biometrics.BloodGlucose.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-glucose', router);
};
