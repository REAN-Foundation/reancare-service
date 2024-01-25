import express from 'express';
import { UserEngagementController } from './user.engagement.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserEngagementController();

    router.get('/yearly', auth('Statistics.UserEngagement.GetUserEngagementStatsByYear'), controller.getUserEngagementStatsByYear);
    router.get('/quarterly', auth('Statistics.UserEngagement.GetUserEngagementStatsByQuarter'), controller.getUserEngagementStatsByQuarter);
    router.get('/monthly', auth('Statistics.UserEngagement.GetUserEngagementStatsByMonth'), controller.getUserEngagementStatsByYear);
    router.get('/weekly', auth('Statistics.UserEngagement.GetUserEngagementStatsByWeek'), controller.getUserEngagementStatsByWeek);
    router.get('/by-date-range', auth('Statistics.UserEngagement.GetUserEngagementStatsByDateRange'), controller.getUserEngagementStatsByDateRange);
    router.get('/users/:userId', auth('Statistics.UserEngagement.GetUserEngagementStatsForUser'), controller.getUserEngagementStatsByYear);

    app.use('/api/v1/user-engagements', router);
};
