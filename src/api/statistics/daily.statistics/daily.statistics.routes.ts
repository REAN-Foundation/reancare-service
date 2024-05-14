import express from 'express';
import { DailyStatisticsController } from './daily.statistics.controller';
import { auth } from '../../../auth/auth.handler';
import { DailyStatisticsAuth } from './daily.statistics.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new DailyStatisticsController();

    router.get('/tenants/:tenantId', auth(DailyStatisticsAuth.getDailyTenantStats), controller.getDailyTenantStats);
   
    router.get('/', auth(DailyStatisticsAuth.getDailySystemStats), controller.getDailySystemStats);

    app.use('/api/v1/daily-stats', router);

};
