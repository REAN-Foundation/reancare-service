import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodPressureController } from './blood.pressure.controller';
import { BloodPressureAuth } from './blood.pressure.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodPressureController();

    router.post('/', auth(BloodPressureAuth.create), controller.create);
    router.get('/search', auth(BloodPressureAuth.search), controller.search);
    router.get('/:id', auth(BloodPressureAuth.getById), controller.getById);
    router.put('/:id', auth(BloodPressureAuth.update), controller.update);
    router.delete('/:id', auth(BloodPressureAuth.delete), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-pressures', router);
};
