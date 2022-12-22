import express from 'express';
import { Loader } from '../../../../startup/loader';
import { HealthProfileController } from './health.profile.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new HealthProfileController();

    // Please note that -
    // Health profile for a patient will be created when a patient is created. It can only be modified.
    // Currently only get/update methods are provided.

    router.get('/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByPatientUserId);
    router.put('/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateByPatientUserId);

    app.use('/api/v1/patient-health-profiles/', router);
};
