import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { NoticeController } from './notice.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new NoticeController();

    router.post('/', auth('General.Notice.Create'), controller.create);
    router.post('/:id/users/:userId/take-action', auth('General.Notice.TakeAction'), controller.takeAction);
    router.get('/search', auth('General.Notice.Search'), controller.search);
    router.get('/users/:userId', auth('General.Notice.GetAllNoticeActionsForUser'), controller.getAllNoticeActionsForUser);
    router.get('/:id/users/:userId', auth('General.Notice.GetNoticeActionForUser'), controller.getNoticeActionForUser);
    router.get('/:id', auth('General.Notice.GetById'), controller.getNotice);
    router.put('/:id', auth('General.Notice.Update'), controller.updateNotice);
    router.delete('/:id', auth('General.Notice.Delete'), controller.deleteNotice);

    app.use('/api/v1/general/notices', router);
};
