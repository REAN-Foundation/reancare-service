import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { ActionPlanController } from './action.plan.controller';
import { ActionPlanAuth } from './action.plan.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ActionPlanController();

    router.post('/', auth(ActionPlanAuth.create), controller.create);
    router.get('/search', auth(ActionPlanAuth.search), controller.search);
    router.get('/for-patient/:patientUserId', auth(ActionPlanAuth.getSelectedActionPlans), controller.getSelectedActionPlans);
    router.get('/by-goal/:goalId', auth(ActionPlanAuth.getActionPlans), controller.getActionPlans);
    router.put('/:id', auth(ActionPlanAuth.update), controller.update);
    router.delete('/:id', auth(ActionPlanAuth.delete), controller.delete);

    app.use('/api/v1/action-plans', router);
};
