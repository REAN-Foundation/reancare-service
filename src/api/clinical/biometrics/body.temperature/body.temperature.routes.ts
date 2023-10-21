import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BodyTemperatureController } from './body.temperature.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BodyTemperatureController();

    router.post('/', auth('Biometrics.BodyTemperature.Create'), controller.create);
    router.get('/search', auth('Biometrics.BodyTemperature.Search'), controller.search);
    router.get('/:id', auth('Biometrics.BodyTemperature.GetById'), controller.getById);
    router.put('/:id', auth('Biometrics.BodyTemperature.Update'), controller.update);
    router.delete('/:id', auth('Biometrics.BodyTemperature.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/body-temperatures', router);
};
