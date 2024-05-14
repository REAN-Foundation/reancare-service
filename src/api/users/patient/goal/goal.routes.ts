import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { GoalController } from './goal.controller';
import { GoalAuth } from './goal.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new GoalController();

    router.post('/', auth(GoalAuth.create), controller.create);
    router.get('/search', auth(GoalAuth.search), controller.search);
    router.get('/by-priority/:priorityId', auth(GoalAuth.getGoalsByPriority), controller.getGoalsByPriority);
    router.get('/for-patient/:patientUserId', auth(GoalAuth.getPatientGoals), controller.getPatientGoals);
    router.get('/:id', auth(GoalAuth.getById), controller.getById);
    router.put('/:id', auth(GoalAuth.update), controller.update);
    router.delete('/:id', auth(GoalAuth.delete), controller.delete);

    app.use('/api/v1/patient-goals', router);
};
