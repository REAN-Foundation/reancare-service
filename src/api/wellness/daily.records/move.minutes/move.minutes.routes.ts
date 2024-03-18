import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MoveMinutesController } from './move.minutes.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MoveMinutesController();

    router.post('/', auth('Wellness.DailyRecords.MoveMinutes.Create'), controller.create);
    router.get('/search', auth('Wellness.DailyRecords.MoveMinutes.Search'), controller.search);
    router.get('/:id', auth('Wellness.DailyRecords.MoveMinutes.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.DailyRecords.MoveMinutes.Update'), controller.update);
    router.delete('/:id', auth('Wellness.DailyRecords.MoveMinutes.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/move-minutes', router);
};
