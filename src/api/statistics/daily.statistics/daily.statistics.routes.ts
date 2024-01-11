import express from 'express';
import { DailyStatisticsController } from './daily.statistics.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new DailyStatisticsController();

    router.get('/', controller.getLatestStatistics);
   
    app.use('/api/v1/daily-stats', router);
};
