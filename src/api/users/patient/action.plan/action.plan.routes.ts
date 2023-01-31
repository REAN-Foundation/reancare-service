import express from 'express';
import { Loader } from '../../../../startup/loader';
import { ActionPlanController } from './action.plan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ActionPlanController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/for-patient/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getSelectedActionPlans);
    router.get('/by-goal/:goalId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getActionPlans);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/action-plans', router);
};
