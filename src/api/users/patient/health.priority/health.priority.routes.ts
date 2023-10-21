import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HealthPriorityController } from './health.priority.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthPriorityController();

    router.post('/', auth('HealthPriority.Create'), controller.create);
    router.get('/search', auth('HealthPriority.Search'), controller.search);
    router.get('/for-patient/:patientUserId', auth('HealthPriority.getPatientHealthPriorities'), controller.getPatientHealthPriorities);
    router.put('/:id', auth('HealthPriority.Update'), controller.update);
    router.delete('/:id', auth('HealthPriority.Delete'), controller.delete);

    app.use('/api/v1/patient-health-priorities', router);
};
