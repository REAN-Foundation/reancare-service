import express from 'express';
import { UserEngagementController } from './user.engagement.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserEngagementController();

    router.get('/yearly', auth('UserEngagement.GetUserEngagementStatsByYear'), controller.getUserEngagementStatsByYear);
    router.get('/quarterly', auth('UserEngagement.GetUserEngagementStatsByQuarter'), controller.getUserEngagementStatsByQuarter);
    router.get('/monthly', auth('UserEngagement.GetUserEngagementStatsByMonth'), controller.getUserEngagementStatsByYear);
    router.get('/weekly', auth('UserEngagement.GetUserEngagementStatsByWeek'), controller.getUserEngagementStatsByWeek);
    router.get('/by-date-range', auth('UserEngagement.GetUserEngagementStatsByDateRange'), controller.getUserEngagementStatsByDateRange);
    router.get('/users/:userId', auth('UserEngagement.GetUserEngagementStatsForUser'), controller.getUserEngagementStatsByYear);

    app.use('/api/v1/user-engagements', router);
};
