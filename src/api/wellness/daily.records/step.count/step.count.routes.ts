import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StepCountController } from './step.count.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StepCountController();

    router.post('/', auth('DailyRecords.StepCount.Create'), controller.create);
    router.get('/search', auth('DailyRecords.StepCount.Search'), controller.search);
    router.get('/:id', auth('DailyRecords.StepCount.GetById'), controller.getById);
    router.put('/:id', auth('DailyRecords.StepCount.Update'), controller.update);
    router.delete('/:id', auth('DailyRecords.StepCount.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/step-counts', router);
};
