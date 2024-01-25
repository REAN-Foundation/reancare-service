import express from 'express';
import { AhaStatisticsController } from './aha.statistics.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AhaStatisticsController();

    router.get('/', auth('Statistics.AHAStatistics.GetAHAStatistics'), controller.getAhaStatistics);
   
    app.use('/api/v1/aha-statistics', router);
};
