import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HealthProfileController } from './health.profile.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthProfileController();

    // Please note that -
    // Health profile for a patient will be created when a patient is created. It can only be modified.
    // Currently only get/update methods are provided.

    router.get('/:patientUserId', auth('Users.Patients.HealthProfile.GetByPatientUserId'), controller.getByPatientUserId);
    router.put('/:patientUserId', auth('Users.Patients.HealthProfile.UpdateByPatientUserId'), controller.updateByPatientUserId);

    app.use('/api/v1/patient-health-profiles/', router);
};
