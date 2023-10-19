import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { GoalController } from './goal.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new GoalController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/by-priority/:priorityId', auth(), controller.getGoalsByPriority);
    router.get('/for-patient/:patientUserId', auth(), controller.getPatientGoals);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/patient-goals', router);
};
