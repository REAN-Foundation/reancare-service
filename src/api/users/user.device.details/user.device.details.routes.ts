/* eslint-disable max-len */
import express from 'express';
import { UserDeviceDetailsController } from './user.device.details.controller ';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserDeviceDetailsController();

    router.post('/', auth('UserDeviceDetails.Create', true), controller.create);
    router.post('/notification', auth('UserDeviceDetails.SendTestNotification'), controller.sendTestNotification);
    router.get('/search', auth('UserDeviceDetails.Search'), controller.search);
    router.get('/by-user-id/:userId', auth('UserDeviceDetails.GetByUserId'), controller.getByUserId);
    router.get('/:id', auth('UserDeviceDetails.GetById'), controller.getById);
    router.put('/:id', auth('UserDeviceDetails.Update'), controller.update);
    router.delete('/:id', auth('UserDeviceDetails.Delete'), controller.delete);

    app.use('/api/v1/user-device-details', router);
};
