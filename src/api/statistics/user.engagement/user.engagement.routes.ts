import express from 'express';
import { UserEngagementController } from './user.engagement.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserEngagementController();

    router.get('/yearly', auth(), controller.getUserEngagementStatsByYear);
    router.get('/quarterly', auth(), controller.getUserEngagementStatsByQuarter);
    router.get('/monthly', auth(), controller.getUserEngagementStatsByYear);
    router.get('/weekly', auth(), controller.getUserEngagementStatsByWeek);
    router.get('/by-date-range', auth(), controller.getUserEngagementStatsByDateRange);
    router.get('/users/:userId', auth(), controller.getUserEngagementStatsByYear);

    app.use('/api/v1/user-engagements', router);
};
