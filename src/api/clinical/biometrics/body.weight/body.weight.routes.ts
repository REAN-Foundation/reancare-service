/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BodyWeightController } from './body.weight.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BodyWeightController();

    router.post('/', auth('Biometrics.BodyWeight.Create'), controller.create);
    router.get('/search', auth('Biometrics.BodyWeight.Search'), controller.search);
    router.get('/:id', auth('Biometrics.BodyWeight.GetById'), controller.getById);
    router.put('/:id', auth('Biometrics.BodyWeight.Update'), controller.update);
    router.delete('/:id', auth('Biometrics.BodyWeight.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/body-weights', router);
};
