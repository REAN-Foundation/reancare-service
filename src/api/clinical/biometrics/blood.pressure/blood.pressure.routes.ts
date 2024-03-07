import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodPressureController } from './blood.pressure.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodPressureController();

    router.post('/', auth('Clinical.Biometrics.BloodPressure.Create'), controller.create);
    router.get('/search', auth('Clinical.Biometrics.BloodPressure.Search'), controller.search);
    router.get('/:id', auth('Clinical.Biometrics.BloodPressure.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Biometrics.BloodPressure.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Biometrics.BloodPressure.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-pressures', router);
};
