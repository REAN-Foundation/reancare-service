import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { GoalController } from './goal.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new GoalController();

    router.post('/', auth('Users.Patients.Goal.Create'), controller.create);
    router.get('/search', auth('Users.Patients.Goal.Search'), controller.search);
    router.get('/by-priority/:priorityId', auth('Users.Patients.Goal.GetGoalsByPriority'), controller.getGoalsByPriority);
    router.get('/for-patient/:patientUserId', auth('Users.Patients.Goal.GetPatientGoals'), controller.getPatientGoals);
    router.get('/:id', auth('Users.Patients.Goal.GetById'), controller.getById);
    router.put('/:id', auth('Users.Patients.Goal.Update'), controller.update);
    router.delete('/:id', auth('Users.Patients.Goal.Delete'), controller.delete);

    app.use('/api/v1/patient-goals', router);
};
