/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MeditationController } from './meditation.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MeditationController();

    router.post('/', auth('Wellness.Exercise.Meditation.Create'), controller.create);
    router.get('/search', auth('Wellness.Exercise.Meditation.Search'), controller.search);
    router.get('/:id', auth('Wellness.Exercise.Meditation.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.Exercise.Meditation.Update'), controller.update);
    router.delete('/:id', auth('Wellness.Exercise.Meditation.Delete'), controller.delete);

    app.use('/api/v1/wellness/exercise/meditations', router);
};
