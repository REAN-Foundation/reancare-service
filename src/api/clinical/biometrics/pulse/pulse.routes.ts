/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PulseController } from './pulse.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PulseController();

    router.post('/', auth('Biometrics.Pulse.Create'), controller.create);
    router.get('/search', auth('Biometrics.Pulse.Search'), controller.search);
    router.get('/:id', auth('Biometrics.Pulse.GetById'), controller.getById);
    router.put('/:id', auth('Biometrics.Pulse.Update'), controller.update);
    router.delete('/:id', auth('Biometrics.Pulse.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/pulse', router);
};
