import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { NoticeController } from './notice.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new NoticeController();

    router.post('/', auth(), controller.create);
    router.post('/:id/users/:userId/take-action', auth(), controller.takeAction);
    router.get('/search', auth(), controller.search);
    router.get('/users/:userId', auth(), controller.getAllNoticeActionsForUser);
    router.get('/:id/users/:userId', auth(), controller.getNoticeActionForUser);
    router.get('/:id', auth(), controller.getNotice);
    router.put('/:id', auth(), controller.updateNotice);
    router.delete('/:id', auth(), controller.deleteNotice);

    app.use('/api/v1/general/notices', router);
};
