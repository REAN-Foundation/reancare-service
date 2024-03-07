/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodGlucoseController } from './blood.glucose.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodGlucoseController();

    router.post('/', auth('Clinical.Biometrics.BloodGlucose.Create'), controller.create);
    router.get('/search', auth('Clinical.Biometrics.BloodGlucose.Search'), controller.search);
    router.get('/:id', auth('Clinical.Biometrics.BloodGlucose.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Biometrics.BloodGlucose.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Biometrics.BloodGlucose.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-glucose', router);
};
