import express from 'express';
import { Loader } from '../../../../startup/loader';
import { GoalController } from './goal.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new GoalController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/by-priority/:priorityId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getGoalsByPriority);
    router.get('/for-patient/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPatientGoals);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/patient-goals', router);
};
