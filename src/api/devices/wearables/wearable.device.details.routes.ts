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

    // Obsolete routes. Will be discontinued in future
    const obsoleteRouter = express.Router();
    obsoleteRouter.post('/', auth(WearableAuth.create), controller.create);
    obsoleteRouter.get('/search', auth(WearableAuth.search), controller.search);
    obsoleteRouter.get('/patients/:patientUserId', auth(WearableAuth.getUserWearables), controller.getPatientWearableDeviceDetails);
    obsoleteRouter.get('/:id', auth(WearableAuth.getById), controller.getById);
    obsoleteRouter.put('/:id', auth(WearableAuth.update), controller.update);
    obsoleteRouter.delete('/:id', auth(WearableAuth.delete), controller.delete);

    app.use('/api/v1/wearable-device-details', obsoleteRouter);
};
