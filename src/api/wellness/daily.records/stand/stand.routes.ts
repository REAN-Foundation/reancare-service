import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StandController } from './stand.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StandController();

    router.post('/', auth('DailyRecords.Stand.Create'), controller.create);
    router.get('/search', auth('DailyRecords.Stand.Search'), controller.search);
    router.get('/:id', auth('DailyRecords.Stand.GetById'), controller.getById);
    router.put('/:id', auth('DailyRecords.Stand.Update'), controller.update);
    router.delete('/:id', auth('DailyRecords.Stand.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/stand', router);
};
