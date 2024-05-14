/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PulseController } from './pulse.controller';
import { PulseAuth } from './pulse.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PulseController();

    router.post('/', auth(PulseAuth.create), controller.create);
    router.get('/search', auth(PulseAuth.create), controller.search);
    router.get('/:id', auth(PulseAuth.create), controller.getById);
    router.put('/:id', auth(PulseAuth.create), controller.update);
    router.delete('/:id', auth(PulseAuth.create), controller.delete);

    app.use('/api/v1/clinical/biometrics/pulse', router);
};
