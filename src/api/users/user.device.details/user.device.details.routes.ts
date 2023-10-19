/* eslint-disable max-len */
import express from 'express';
import { UserDeviceDetailsController } from './user.device.details.controller ';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserDeviceDetailsController();

    router.post('/', controller.create);
    router.post('/notification', auth(), controller.sendTestNotification);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/user-device-details', router);
};
