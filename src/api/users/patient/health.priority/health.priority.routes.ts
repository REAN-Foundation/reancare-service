import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HealthPriorityController } from './health.priority.controller';
import { HealthPriorityAuth } from './health.priority.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthPriorityController();

    router.post('/', auth(HealthPriorityAuth.create), controller.create);
    router.get('/search', auth(HealthPriorityAuth.search), controller.search);
    router.get('/for-patient/:patientUserId', auth(HealthPriorityAuth.getPatientHealthPriorities), controller.getPatientHealthPriorities);
    router.put('/:id', auth(HealthPriorityAuth.update), controller.update);
    router.delete('/:id', auth(HealthPriorityAuth.delete), controller.delete);

    app.use('/api/v1/patient-health-priorities', router);
};
