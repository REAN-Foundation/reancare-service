/* eslint-disable max-len */
import express from 'express';
import { UserDeviceDetailsController } from './user.device.details.controller ';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserDeviceDetailsController();

    router.post('/', auth('User.DeviceDetails.Create', true), controller.create);
    router.post('/notification', auth('User.DeviceDetails.SendTestNotification'), controller.sendTestNotification);
    router.get('/search', auth('User.DeviceDetails.Search'), controller.search);
    router.get('/by-user-id/:userId', auth('User.DeviceDetails.GetByUserId'), controller.getByUserId);
    router.get('/:id', auth('User.DeviceDetails.GetById'), controller.getById);
    router.put('/:id', auth('User.DeviceDetails.Update'), controller.update);
    router.delete('/:id', auth('User.DeviceDetails.Delete'), controller.delete);

    app.use('/api/v1/user-device-details', router);
};
