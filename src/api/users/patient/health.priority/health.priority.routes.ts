import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HealthPriorityController } from './health.priority.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthPriorityController();

    router.post('/', auth('User.Patient.HealthPriority.Create'), controller.create);
    router.get('/search', auth('User.Patient.HealthPriority.Search'), controller.search);
    router.get('/for-patient/:patientUserId', auth('User.Patient.HealthPriority.getPatientHealthPriorities'), controller.getPatientHealthPriorities);
    router.put('/:id', auth('User.Patient.HealthPriority.Update'), controller.update);
    router.delete('/:id', auth('User.Patient.HealthPriority.Delete'), controller.delete);

    app.use('/api/v1/patient-health-priorities', router);
};
