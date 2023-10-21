import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { GoalController } from './goal.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new GoalController();

    router.post('/', auth('Goal.Create'), controller.create);
    router.get('/search', auth('Goal.Search'), controller.search);
    router.get('/by-priority/:priorityId', auth('Goal.GetGoalsByPriority'), controller.getGoalsByPriority);
    router.get('/for-patient/:patientUserId', auth('Goal.GetPatientGoals'), controller.getPatientGoals);
    router.get('/:id', auth('Goal.GetById'), controller.getById);
    router.put('/:id', auth('Goal.Update'), controller.update);
    router.delete('/:id', auth('Goal.Delete'), controller.delete);

    app.use('/api/v1/patient-goals', router);
};
