/* eslint-disable max-len */
import express from 'express';
import { UserDeviceDetailsController } from './user.device.details.controller ';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserDeviceDetailsController();

    router.post('/', auth('Users.DeviceDetails.Create', true), controller.create);
    router.post('/notification', auth('Users.DeviceDetails.SendTestNotification'), controller.sendTestNotification);
    router.get('/search', auth('Users.DeviceDetails.Search'), controller.search);
    router.get('/by-user-id/:userId', auth('Users.DeviceDetails.GetByUserId'), controller.getByUserId);
    router.get('/:id', auth('Users.DeviceDetails.GetById'), controller.getById);
    router.put('/:id', auth('Users.DeviceDetails.Update'), controller.update);
    router.delete('/:id', auth('Users.DeviceDetails.Delete'), controller.delete);

    app.use('/api/v1/user-device-details', router);
};
