import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { SleepController } from './sleep.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SleepController();

    router.post('/', auth('Wellness.DailyRecords.Sleep.Create'), controller.create);
    router.get('/search', auth('Wellness.DailyRecords.Sleep.Search'), controller.search);
    router.get('/:id', auth('Wellness.DailyRecords.Sleep.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.DailyRecords.Sleep.Update'), controller.update);
    router.delete('/:id', auth('Wellness.DailyRecords.Sleep.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/sleep', router);
};
