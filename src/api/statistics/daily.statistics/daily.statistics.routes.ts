import express from 'express';
import { Loader } from '../../../startup/loader';
import { DailyStatisticsController } from './daily.statistics.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new DailyStatisticsController();

    router.get('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.getLatestStatistics);
   
    app.use('/api/v1/daily-stats', router);
};
