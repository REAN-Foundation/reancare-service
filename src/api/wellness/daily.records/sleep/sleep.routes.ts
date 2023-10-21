import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { SleepController } from './sleep.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SleepController();

    router.post('/', auth('DailyRecords.Sleep.Create'), controller.create);
    router.get('/search', auth('DailyRecords.Sleep.Search'), controller.search);
    router.get('/:id', auth('DailyRecords.Sleep.GetById'), controller.getById);
    router.put('/:id', auth('DailyRecords.Sleep.Update'), controller.update);
    router.delete('/:id', auth('DailyRecords.Sleep.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/sleep', router);
};
