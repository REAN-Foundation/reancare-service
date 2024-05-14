/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { UserTaskController } from './user.task.controller';
import { UserTaskAuth } from './user.task.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserTaskController();

    router.get("/categories", auth(UserTaskAuth.getCategories), controller.getCategories);
    router.get("/action-types", auth(UserTaskAuth.getUserActionTypes), controller.getUserActionTypes);

    router.post('/', auth(UserTaskAuth.create), controller.create);
    router.get('/search', auth(UserTaskAuth.search), controller.search);

    router.put("/:id/start", auth(UserTaskAuth.startTask), controller.startTask);
    router.put("/:id/finish", auth(UserTaskAuth.finishTask), controller.finishTask);
    router.put("/:id/cancel", auth(UserTaskAuth.cancelTask), controller.cancelTask);

    router.get("/users/:userId/summary-for-day/:date", auth(UserTaskAuth.getTaskSummaryForDay), controller.getTaskSummaryForDay);
    router.get('/display-id/:displayId', auth(UserTaskAuth.getByDisplayId), controller.getByDisplayId);
    router.get('/:id', auth(UserTaskAuth.getById), controller.getById);
    router.put('/:id', auth(UserTaskAuth.update), controller.update);
    router.delete('/:id', auth(UserTaskAuth.delete), controller.delete);
    router.delete('/users/:userId', auth(UserTaskAuth.deletePatientFutureTask), controller.deletePatientFutureTask);

    app.use('/api/v1/user-tasks', router);
};
