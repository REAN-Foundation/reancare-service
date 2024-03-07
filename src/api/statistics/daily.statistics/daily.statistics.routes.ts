import express from 'express';
import { DailyStatisticsController } from './daily.statistics.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new DailyStatisticsController();

    router.get('/tenants/:tenantId', auth('Statistics.DailyStatistics.GetDailyTenantStats'), controller.getDailyTenantStats);
   
    router.get('/', auth('Statistics.DailyStatistics.GetDailyTenantStats'), controller.getDailySystemStats);

    app.use('/api/v1/daily-stats', router);

};
