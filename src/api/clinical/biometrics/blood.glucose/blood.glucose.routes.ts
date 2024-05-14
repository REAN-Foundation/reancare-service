/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodGlucoseController } from './blood.glucose.controller';
import { BloodGlucoseAuth } from './blood.glucose.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodGlucoseController();

    router.post('/', auth(BloodGlucoseAuth.create), controller.create);
    router.get('/search', auth(BloodGlucoseAuth.search), controller.search);
    router.get('/:id', auth(BloodGlucoseAuth.getById), controller.getById);
    router.put('/:id', auth(BloodGlucoseAuth.update), controller.update);
    router.delete('/:id', auth(BloodGlucoseAuth.delete), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-glucose', router);
};
