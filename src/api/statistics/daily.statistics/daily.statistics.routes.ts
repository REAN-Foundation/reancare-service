import express from 'express';
import { DailyStatisticsController } from './daily.statistics.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new DailyStatisticsController();

    router.get('/', auth('DailyStatistics.GetLatestStatistics'), controller.getLatestStatistics);
   
    app.use('/api/v1/daily-stats', router);
};
