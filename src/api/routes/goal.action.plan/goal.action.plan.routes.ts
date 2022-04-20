import express from 'express';
import { Loader } from '../../../startup/loader';
import { ActionPlanController } from '../../controllers/goal.action.plan/goal.action.plan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ActionPlanController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/for-patient/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getSelectedActionPlans);
    router.get('/by-goal/:goalId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getActionPlans);
    
    app.use('/api/v1/goal-action-plans', router);
};
