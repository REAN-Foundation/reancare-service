import express from 'express';
import { NotificationController } from './notification.controller';
import { auth } from '../../../auth/auth.handler';
import { NotificationAuth } from './notification.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new NotificationController();

    router.post('/', auth(NotificationAuth.create), controller.create);
    router.get('/search', auth(NotificationAuth.search), controller.search);
    router.get('/:id', auth(NotificationAuth.getById), controller.getById);
    router.post('/:id/send', auth(NotificationAuth.send), controller.send);
    router.get('/:id/send-to-user/:userId', auth(NotificationAuth.sendToUser), controller.sendToUser);
    router.put('/:id/mark-as-read/:userId', auth(NotificationAuth.markAsRead), controller.markAsRead);
    router.put('/:id', auth(NotificationAuth.update), controller.update);
    router.delete('/:id', auth(NotificationAuth.delete), controller.delete);

    app.use('/api/v1/general/notifications', router);
};
