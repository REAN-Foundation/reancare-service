/* eslint-disable max-len */
import express from 'express';
import { Loader } from '../../../startup/loader';
import { UserTaskController } from './user.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserTaskController();

    router.get("/categories", authenticator.authenticateClient, authenticator.authenticateUser, controller.getCategories);
    router.get("/action-types", authenticator.authenticateClient, authenticator.authenticateUser, controller.getUserActionTypes);

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);

    router.put("/:id/start", authenticator.authenticateClient, authenticator.authenticateUser, controller.startTask);
    router.put("/:id/finish", authenticator.authenticateClient, authenticator.authenticateUser, controller.finishTask);
    router.put("/:id/cancel", authenticator.authenticateClient, authenticator.authenticateUser, controller.cancelTask);

    router.get("/users/:userId/summary-for-day/:date", authenticator.authenticateClient, authenticator.authenticateUser, controller.getTaskSummaryForDay);
    router.get('/display-id/:displayId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByDisplayId);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    router.delete('/users/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.deletePatientFutureTask);

    app.use('/api/v1/user-tasks', router);
};
