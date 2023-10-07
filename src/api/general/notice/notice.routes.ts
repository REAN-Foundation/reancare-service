import express from 'express';
import { Loader } from '../../../startup/loader';
import { NoticeController } from './notice.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new NoticeController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.post('/:id/users/:userId/take-action', authenticator.authenticateUser, controller.takeAction);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/users/:userId', authenticator.authenticateUser, controller.getAllNoticeActionsForUser);
    router.get('/:id/users/:userId', authenticator.authenticateUser, controller.getNoticeActionForUser);
    router.get('/:id', authenticator.authenticateUser, controller.getNotice);
    router.put('/:id', authenticator.authenticateUser, controller.updateNotice);
    router.delete('/:id', authenticator.authenticateUser, controller.deleteNotice);

    app.use('/api/v1/general/notices', router);
};
