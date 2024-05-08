/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BodyWeightController } from './body.weight.controller';
import { BodyWeightAuth } from './body.weight.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BodyWeightController();

    router.post('/', auth(BodyWeightAuth.create), controller.create);
    router.get('/search', auth(BodyWeightAuth.search), controller.search);
    router.get('/:id', auth(BodyWeightAuth.getById), controller.getById);
    router.put('/:id', auth(BodyWeightAuth.update), controller.update);
    router.delete('/:id', auth(BodyWeightAuth.delete), controller.delete);

    app.use('/api/v1/clinical/biometrics/body-weights', router);
};
