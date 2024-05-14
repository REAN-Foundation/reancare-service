/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MeditationController } from './meditation.controller';
import { MeditationAuth } from './meditation.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MeditationController();

    router.post('/', auth(MeditationAuth.create), controller.create);
    router.get('/search', auth(MeditationAuth.search), controller.search);
    router.get('/:id', auth(MeditationAuth.getById), controller.getById);
    router.put('/:id', auth(MeditationAuth.update), controller.update);
    router.delete('/:id', auth(MeditationAuth.delete), controller.delete);

    app.use('/api/v1/wellness/exercise/meditations', router);
};
