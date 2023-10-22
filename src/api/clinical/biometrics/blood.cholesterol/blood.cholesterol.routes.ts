import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodCholesterolController } from './blood.cholesterol.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodCholesterolController();

    router.post('/', auth('Clinical.Biometrics.BloodCholesterol.Create'), controller.create);
    router.get('/search', auth('Clinical.Biometrics.BloodCholesterol.Search'), controller.search);
    router.get('/:id', auth('Clinical.Biometrics.BloodCholesterol.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Biometrics.BloodCholesterol.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Biometrics.BloodCholesterol.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-cholesterol', router);
};
