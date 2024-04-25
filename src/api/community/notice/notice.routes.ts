import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { NoticeController } from './notice.controller';
import { NoticeAuth } from './notice.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new NoticeController();

    router.post('/', auth(NoticeAuth.create), controller.create);
    router.post('/:id/users/:userId/take-action', auth(NoticeAuth.takeAction), controller.takeAction);
    router.get('/search', auth(NoticeAuth.search), controller.search);
    router.get('/users/:userId', auth(NoticeAuth.getAllNoticeActionsForUser), controller.getAllNoticeActionsForUser);
    router.get('/:id/users/:userId', auth(NoticeAuth.getNoticeActionForUser), controller.getNoticeActionForUser);
    router.get('/:id', auth(NoticeAuth.getById), controller.getNotice);
    router.put('/:id', auth(NoticeAuth.update), controller.updateNotice);
    router.delete('/:id', auth(NoticeAuth.delete), controller.deleteNotice);

    app.use('/api/v1/general/notices', router);
};
