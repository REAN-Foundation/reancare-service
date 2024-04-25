import express from 'express';
import { UserEngagementController } from './user.engagement.controller';
import { auth } from '../../../auth/auth.handler';
import { UserEngagementAuth } from './user.engagement.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserEngagementController();

    router.get('/yearly', auth(UserEngagementAuth.getUserEngagementStatsByYear), controller.getUserEngagementStatsByYear);
    router.get('/quarterly', auth(UserEngagementAuth.getUserEngagementStatsByQuarter), controller.getUserEngagementStatsByQuarter);
    router.get('/monthly', auth(UserEngagementAuth.getUserEngagementStatsByMonth), controller.getUserEngagementStatsByMonth);
    router.get('/weekly', auth(UserEngagementAuth.getUserEngagementStatsByWeek), controller.getUserEngagementStatsByWeek);
    router.get('/by-date-range', auth(UserEngagementAuth.getUserEngagementStatsByDateRange), controller.getUserEngagementStatsByDateRange);
    router.get('/users/:userId', auth(UserEngagementAuth.getUserEngagementStatsForUser), controller.getUserEngagementStatsForUser);

    app.use('/api/v1/user-engagemenUserEngagementAuth.ts', router);
};
