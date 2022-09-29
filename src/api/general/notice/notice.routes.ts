import express from 'express';
import { Loader } from '../../../startup/loader';
import { NoticeController } from './notice.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new NoticeController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.post('/:id/users/:userId/take-action', authenticator.authenticateClient,
        authenticator.authenticateUser, controller.createAction);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.get('/:id/actions', authenticator.authenticateClient,
        authenticator.authenticateUser, controller.getActionById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/notices', router);
};
