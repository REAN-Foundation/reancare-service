/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { UserTaskController } from './user.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserTaskController();

    router.get("/categories", auth(), controller.getCategories);
    router.get("/action-types", auth(), controller.getUserActionTypes);

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);

    router.put("/:id/start", auth(), controller.startTask);
    router.put("/:id/finish", auth(), controller.finishTask);
    router.put("/:id/cancel", auth(), controller.cancelTask);

    router.get("/users/:userId/summary-for-day/:date", auth(), controller.getTaskSummaryForDay);
    router.get('/display-id/:displayId', auth(), controller.getByDisplayId);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);
    router.delete('/users/:userId', auth(), controller.deletePatientFutureTask);

    app.use('/api/v1/user-tasks', router);
};
