import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodCholesterolController } from './blood.cholesterol.controller';
import { BloodCholesterolAuth } from './blood.cholesterol.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodCholesterolController();

    router.post('/', auth(BloodCholesterolAuth.create), controller.create);
    router.get('/search', auth(BloodCholesterolAuth.search), controller.search);
    router.get('/:id', auth(BloodCholesterolAuth.getById), controller.getById);
    router.put('/:id', auth(BloodCholesterolAuth.update), controller.update);
    router.delete('/:id', auth(BloodCholesterolAuth.delete), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-cholesterol', router);
};
