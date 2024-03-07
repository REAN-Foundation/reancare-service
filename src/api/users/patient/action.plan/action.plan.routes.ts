import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { ActionPlanController } from './action.plan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ActionPlanController();

    router.post('/', auth('User.Patient.ActionPlan.Create'), controller.create);
    router.get('/search', auth('User.Patient.ActionPlan.Search'), controller.search);
    router.get('/for-patient/:patientUserId', auth('User.Patient.ActionPlan.GetSelectedActionPlans'), controller.getSelectedActionPlans);
    router.get('/by-goal/:goalId', auth('User.Patient.ActionPlan.GetActionPlans'), controller.getActionPlans);
    router.put('/:id', auth('User.Patient.ActionPlan.Update'), controller.update);
    router.delete('/:id', auth('User.Patient.ActionPlan.Delete'), controller.delete);

    app.use('/api/v1/action-plans', router);
};
