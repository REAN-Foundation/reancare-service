import express from 'express';
import { NotificationController } from './notification.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new NotificationController();

    router.post('/', auth('General.Notification.Create'), controller.create);
    router.get('/search', auth('General.Notification.Search'), controller.search);
    router.get('/:id', auth('General.Notification.GetById'), controller.getById);
    router.put('/:id/mark-as-read', auth('General.Notification.MarkAsRead'), controller.markAsRead);
    router.put('/:id', auth('General.Notification.Update'), controller.update);
    router.delete('/:id', auth('General.Notification.Delete'), controller.delete);

    app.use('/api/v1/general/notifications', router);
};
