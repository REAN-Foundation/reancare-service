import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MoveMinutesController } from './move.minutes.controller';
import { MoveMinuteAuth } from './move.minutes.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MoveMinutesController();

    router.post('/', auth(MoveMinuteAuth.create), controller.create);
    router.get('/search', auth(MoveMinuteAuth.search), controller.search);
    router.get('/:id', auth(MoveMinuteAuth.getById), controller.getById);
    router.put('/:id', auth(MoveMinuteAuth.update), controller.update);
    router.delete('/:id', auth(MoveMinuteAuth.delete), controller.delete);

    app.use('/api/v1/wellness/daily-records/move-minutes', router);
};
