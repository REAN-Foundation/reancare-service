/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { WearableDeviceDetailsController } from './wearable.device.details.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new WearableDeviceDetailsController();

    router.post('/', auth('Devices.Wearables.Create'), controller.create);
    router.get('/search', auth('Devices.Wearables.Search'), controller.search);
    router.get('/patients/:patientUserId', auth('Devices.Wearables.GetUserWearables'), controller.getPatientWearableDeviceDetails);
    router.get('/:id', auth('Devices.Wearables.GetById'), controller.getById);
    router.put('/:id', auth('Devices.Wearables.Update'), controller.update);
    router.delete('/:id', auth('Devices.Wearables.Delete'), controller.delete);

    app.use('/api/v1/devices/wearables', router);

    // Obsolute routes. Will be discontinued in future
    const obsoluteRouter = express.Router();
    obsoluteRouter.post('/', auth('Devices.Wearables.Create'), controller.create);
    obsoluteRouter.get('/search', auth('Devices.Wearables.Search'), controller.search);
    obsoluteRouter.get('/patients/:patientUserId', auth('Devices.Wearables.GetUserWearables'), controller.getPatientWearableDeviceDetails);
    obsoluteRouter.get('/:id', auth('Devices.Wearables.GetById'), controller.getById);
    obsoluteRouter.put('/:id', auth('Devices.Wearables.Update'), controller.update);
    obsoluteRouter.delete('/:id', auth('Devices.Wearables.Delete'), controller.delete);

    app.use('/api/v1/wearable-device-details', obsoluteRouter);
};
