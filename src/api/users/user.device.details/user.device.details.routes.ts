/* eslint-disable max-len */
import express from 'express';
import { UserDeviceDetailsController } from './user.device.details.controller ';
import { auth } from '../../../auth/auth.handler';
import { UserDeviceDetailsAuth } from './user.device.details.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserDeviceDetailsController();

    router.post('/', auth(UserDeviceDetailsAuth.create), controller.create);
    router.post('/notification', auth(UserDeviceDetailsAuth.sendTestNotification), controller.sendTestNotification);
    router.post('/notificaion-topic', auth(UserDeviceDetailsAuth.sendNotificationWithTopic), controller.sendNotificationWithTopic);
    router.get('/search', auth(UserDeviceDetailsAuth.search), controller.search);
    router.get('/by-user-id/:userId', auth(UserDeviceDetailsAuth.getByUserId), controller.getByUserId);
    router.get('/:id', auth(UserDeviceDetailsAuth.getById), controller.getById);
    router.put('/:id', auth(UserDeviceDetailsAuth.update), controller.update);
    router.delete('/:id', auth(UserDeviceDetailsAuth.delete), controller.delete);

    app.use('/api/v1/user-device-details', router);
};
