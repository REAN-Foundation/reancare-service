/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { WearableDeviceDetailsController } from './wearable.device.details.controller';
import { WearableAuth } from './wearable.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new WearableDeviceDetailsController();

    router.post('/', auth(WearableAuth.create), controller.create);
    router.get('/search', auth(WearableAuth.search), controller.search);
    router.get('/patients/:patientUserId', auth(WearableAuth.getUserWearables), controller.getPatientWearableDeviceDetails);
    router.get('/:id', auth(WearableAuth.getById), controller.getById);
    router.put('/:id', auth(WearableAuth.update), controller.update);
    router.delete('/:id', auth(WearableAuth.delete), controller.delete);

    app.use('/api/v1/devices/wearables', router);

    // Obsolute routes. Will be discontinued in future
    const obsoluteRouter = express.Router();
    obsoluteRouter.post('/', auth(WearableAuth.create), controller.create);
    obsoluteRouter.get('/search', auth(WearableAuth.search), controller.search);
    obsoluteRouter.get('/patients/:patientUserId', auth(WearableAuth.getUserWearables), controller.getPatientWearableDeviceDetails);
    obsoluteRouter.get('/:id', auth(WearableAuth.getById), controller.getById);
    obsoluteRouter.put('/:id', auth(WearableAuth.update), controller.update);
    obsoluteRouter.delete('/:id', auth(WearableAuth.delete), controller.delete);

    app.use('/api/v1/wearable-device-details', obsoluteRouter);
};
