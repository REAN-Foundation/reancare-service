/* eslint-disable max-len */
import express from 'express';
import { UserDeviceDetailsController } from './user.device.details.controller ';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserDeviceDetailsController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.post('/notification', authenticator.authenticateClient, authenticator.authenticateUser, controller.sendTestNotification);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/user-device-details', router);
};
