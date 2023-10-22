import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { ActionPlanController } from './action.plan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ActionPlanController();

    router.post('/', auth('Users.Patients.ActionPlan.Create'), controller.create);
    router.get('/search', auth('Users.Patients.ActionPlan.Search'), controller.search);
    router.get('/for-patient/:patientUserId', auth('Users.Patients.ActionPlan.GetSelectedActionPlans'), controller.getSelectedActionPlans);
    router.get('/by-goal/:goalId', auth('Users.Patients.ActionPlan.GetActionPlans'), controller.getActionPlans);
    router.put('/:id', auth('Users.Patients.ActionPlan.Update'), controller.update);
    router.delete('/:id', auth('Users.Patients.ActionPlan.Delete'), controller.delete);

    app.use('/api/v1/action-plans', router);
};
