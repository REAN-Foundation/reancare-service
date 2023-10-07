import express from 'express';
import { UserEngagementController } from './user.engagement.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserEngagementController();

    router.get('/yearly', authenticator.authenticateUser, controller.getUserEngagementStatsByYear);
    router.get('/quarterly', authenticator.authenticateUser, controller.getUserEngagementStatsByQuarter);
    router.get('/monthly', authenticator.authenticateUser, controller.getUserEngagementStatsByYear);
    router.get('/weekly', authenticator.authenticateUser, controller.getUserEngagementStatsByWeek);
    router.get('/by-date-range', authenticator.authenticateUser, controller.getUserEngagementStatsByDateRange);
    router.get('/users/:userId', authenticator.authenticateUser, controller.getUserEngagementStatsByYear);

    app.use('/api/v1/user-engagements', router);
};
