import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BodyTemperatureController } from './body.temperature.controller';
import { BodyTemperatureAuth } from './body.temperature.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BodyTemperatureController();

    router.post('/', auth(BodyTemperatureAuth.create), controller.create);
    router.get('/search', auth(BodyTemperatureAuth.search), controller.search);
    router.get('/:id', auth(BodyTemperatureAuth.getById), controller.getById);
    router.put('/:id', auth(BodyTemperatureAuth.update), controller.update);
    router.delete('/:id', auth(BodyTemperatureAuth.delete), controller.delete);

    app.use('/api/v1/clinical/biometrics/body-temperatures', router);
};
