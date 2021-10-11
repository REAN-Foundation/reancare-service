/* eslint-disable max-len */
import express from 'express';
import { Loader } from '../../../startup/loader';
import { UserTaskController } from '../../controllers/user/user.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserTaskController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);

    router.put("/start/:id", authenticator.authenticateClient, authenticator.authenticateUser, controller.startTask);
    router.put("/finish/:id", authenticator.authenticateClient, authenticator.authenticateUser, controller.finishTask);
    router.put("/cancel/:id", authenticator.authenticateClient, authenticator.authenticateUser, controller.cancelTask);

    router.get("/user/:userId/summary-for-day", authenticator.authenticateClient, authenticator.authenticateUser, controller.getTaskSummaryForDay);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    
    app.use('/api/v1/user-task', router);
};
