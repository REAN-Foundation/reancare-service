import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { NoticeController } from './notice.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new NoticeController();

    router.post('/', auth('Community.Notice.Create'), controller.create);
    router.post('/:id/users/:userId/take-action', auth('Community.Notice.TakeAction'), controller.takeAction);
    router.get('/search', auth('Community.Notice.Search'), controller.search);
    router.get('/users/:userId', auth('Community.Notice.GetAllNoticeActionsForUser'), controller.getAllNoticeActionsForUser);
    router.get('/:id/users/:userId', auth('Community.Notice.GetNoticeActionForUser'), controller.getNoticeActionForUser);
    router.get('/:id', auth('Community.Notice.GetById'), controller.getNotice);
    router.put('/:id', auth('Community.Notice.Update'), controller.updateNotice);
    router.delete('/:id', auth('Community.Notice.Delete'), controller.deleteNotice);

    app.use('/api/v1/general/notices', router);
};
