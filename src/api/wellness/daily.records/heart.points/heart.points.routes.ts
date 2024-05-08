import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HeartPointController } from './heart.points.controller';
import { HeartPointAuth } from './heart.points.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HeartPointController();

    router.post('/', auth(HeartPointAuth.create), controller.create);
    router.get('/search', auth(HeartPointAuth.search), controller.search);
    router.get('/:id', auth(HeartPointAuth.getById), controller.getById);
    router.put('/:id', auth(HeartPointAuth.update), controller.update);
    router.delete('/:id', auth(HeartPointAuth.delete), controller.delete);

    app.use('/api/v1/wellness/daily-records/heart-points', router);
};
