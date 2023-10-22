/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PulseController } from './pulse.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PulseController();

    router.post('/', auth('Clinical.Biometrics.Pulse.Create'), controller.create);
    router.get('/search', auth('Clinical.Biometrics.Pulse.Search'), controller.search);
    router.get('/:id', auth('Clinical.Biometrics.Pulse.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Biometrics.Pulse.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Biometrics.Pulse.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/pulse', router);
};
