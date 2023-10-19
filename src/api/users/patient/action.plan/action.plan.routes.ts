import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { ActionPlanController } from './action.plan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ActionPlanController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/for-patient/:patientUserId', auth(), controller.getSelectedActionPlans);
    router.get('/by-goal/:goalId', auth(), controller.getActionPlans);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/action-plans', router);
};
