import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HeartPointController } from './heart.points.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HeartPointController();

    router.post('/', auth('DailyRecords.HeartPoints.Create'), controller.create);
    router.get('/search', auth('DailyRecords.HeartPoints.Search'), controller.search);
    router.get('/:id', auth('DailyRecords.HeartPoints.GetById'), controller.getById);
    router.put('/:id', auth('DailyRecords.HeartPoints.Update'), controller.update);
    router.delete('/:id', auth('DailyRecords.HeartPoints.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/heart-points', router);
};
