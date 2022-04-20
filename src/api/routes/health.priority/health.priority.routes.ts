import express from 'express';
import { Loader } from '../../../startup/loader';
import { HealthPriorityController } from '../../controllers/health.priority/health.priority.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new HealthPriorityController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/types', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPriorityTypes);
    router.get('/for-patient/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPatientHealthPriorities);
    
    app.use('/api/v1/health-priorities', router);
};
