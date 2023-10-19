import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HealthPriorityController } from './health.priority.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthPriorityController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/for-patient/:patientUserId', auth(), controller.getPatientHealthPriorities);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/patient-health-priorities', router);
};
