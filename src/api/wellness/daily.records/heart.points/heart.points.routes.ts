import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HeartPointController } from './heart.points.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HeartPointController();

    router.post('/', auth('Wellness.DailyRecords.HeartPoints.Create'), controller.create);
    router.get('/search', auth('Wellness.DailyRecords.HeartPoints.Search'), controller.search);
    router.get('/:id', auth('Wellness.DailyRecords.HeartPoints.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.DailyRecords.HeartPoints.Update'), controller.update);
    router.delete('/:id', auth('Wellness.DailyRecords.HeartPoints.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/heart-points', router);
};
