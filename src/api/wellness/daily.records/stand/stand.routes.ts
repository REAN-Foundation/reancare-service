import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StandController } from './stand.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StandController();

    router.post('/', auth('Wellness.DailyRecords.Stand.Create'), controller.create);
    router.get('/search', auth('Wellness.DailyRecords.Stand.Search'), controller.search);
    router.get('/:id', auth('Wellness.DailyRecords.Stand.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.DailyRecords.Stand.Update'), controller.update);
    router.delete('/:id', auth('Wellness.DailyRecords.Stand.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/stand', router);
};
