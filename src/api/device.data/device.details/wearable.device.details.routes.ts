/* eslint-disable max-len */
import express from 'express';
import { Loader } from '../../../startup/loader';
import { WearableDeviceDetailsController } from './wearable.device.details.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new WearableDeviceDetailsController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/patients/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPatientWearableDeviceDetails);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/wearable-device-details', router);
};
