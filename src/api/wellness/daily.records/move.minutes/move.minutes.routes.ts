import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MoveMinutesController } from './move.minutes.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MoveMinutesController();

    router.post('/', auth('DailyRecords.MoveMinutes.Create'), controller.create);
    router.get('/search', auth('DailyRecords.MoveMinutes.Search'), controller.search);
    router.get('/:id', auth('DailyRecords.MoveMinutes.GetById'), controller.getById);
    router.put('/:id', auth('DailyRecords.MoveMinutes.Update'), controller.update);
    router.delete('/:id', auth('DailyRecords.MoveMinutes.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/move-minutes', router);
};
