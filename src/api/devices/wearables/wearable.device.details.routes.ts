/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { WearableDeviceDetailsController } from './wearable.device.details.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new WearableDeviceDetailsController();

    router.post('/', controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/patients/:patientUserId', auth(), controller.getPatientWearableDeviceDetails);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/wearable-device-details', router);
};
