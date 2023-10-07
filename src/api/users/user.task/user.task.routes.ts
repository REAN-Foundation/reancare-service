/* eslint-disable max-len */
import express from 'express';
import { Loader } from '../../../startup/loader';
import { UserTaskController } from './user.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserTaskController();

    router.get("/categories", authenticator.authenticateUser, controller.getCategories);
    router.get("/action-types", authenticator.authenticateUser, controller.getUserActionTypes);

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);

    router.put("/:id/start", authenticator.authenticateUser, controller.startTask);
    router.put("/:id/finish", authenticator.authenticateUser, controller.finishTask);
    router.put("/:id/cancel", authenticator.authenticateUser, controller.cancelTask);

    router.get("/users/:userId/summary-for-day/:date", authenticator.authenticateUser, controller.getTaskSummaryForDay);
    router.get('/display-id/:displayId', authenticator.authenticateUser, controller.getByDisplayId);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);
    router.delete('/users/:userId', authenticator.authenticateUser, controller.deletePatientFutureTask);

    app.use('/api/v1/user-tasks', router);
};
