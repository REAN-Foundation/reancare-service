import express from 'express';
import { Loader } from '../../../../startup/loader';
import { HealthPriorityController } from './health.priority.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new HealthPriorityController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/for-patient/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPatientHealthPriorities);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/patient-health-priorities', router);
};
