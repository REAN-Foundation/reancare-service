import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { GoalController } from './goal.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new GoalController();

    router.post('/', auth('User.Patient.Goal.Create'), controller.create);
    router.get('/search', auth('User.Patient.Goal.Search'), controller.search);
    router.get('/by-priority/:priorityId', auth('User.Patient.Goal.GetGoalsByPriority'), controller.getGoalsByPriority);
    router.get('/for-patient/:patientUserId', auth('User.Patient.Goal.GetPatientGoals'), controller.getPatientGoals);
    router.get('/:id', auth('User.Patient.Goal.GetById'), controller.getById);
    router.put('/:id', auth('User.Patient.Goal.Update'), controller.update);
    router.delete('/:id', auth('User.Patient.Goal.Delete'), controller.delete);

    app.use('/api/v1/patient-goals', router);
};
