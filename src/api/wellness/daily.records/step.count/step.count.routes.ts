import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StepCountController } from './step.count.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StepCountController();

    router.post('/', auth('Wellness.DailyRecords.StepCount.Create'), controller.create);
    router.get('/search', auth('Wellness.DailyRecords.StepCount.Search'), controller.search);
    router.get('/:id', auth('Wellness.DailyRecords.StepCount.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.DailyRecords.StepCount.Update'), controller.update);
    router.delete('/:id', auth('Wellness.DailyRecords.StepCount.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/step-counts', router);
};
