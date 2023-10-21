import express from 'express';
import { NotificationController } from './notification.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new NotificationController();

    router.post('/', auth('Notification.Create'), controller.create);
    router.get('/search', auth('Notification.Search'), controller.search);
    router.get('/:id', auth('Notification.GetById'), controller.getById);
    router.put('/:id/mark-as-read', auth('Notification.MarkAsRead'), controller.markAsRead);
    router.put('/:id', auth('Notification.Update'), controller.update);
    router.delete('/:id', auth('Notification.Delete'), controller.delete);

    app.use('/api/v1/general/notifications', router);
};
