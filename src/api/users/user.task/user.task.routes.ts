/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { UserTaskController } from './user.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserTaskController();

    router.get("/categories", auth('UserTask.GetCategories', true), controller.getCategories);
    router.get("/action-types", auth('UserTask.GetUserActionTypes', true), controller.getUserActionTypes);

    router.post('/', auth('UserTask.Create'), controller.create);
    router.get('/search', auth('UserTask.Search'), controller.search);

    router.put("/:id/start", auth('UserTask.StartTask'), controller.startTask);
    router.put("/:id/finish", auth('UserTask.FinishTask'), controller.finishTask);
    router.put("/:id/cancel", auth('UserTask.CancelTask'), controller.cancelTask);

    router.get("/users/:userId/summary-for-day/:date", auth('UserTask.SummaryForDay'), controller.getTaskSummaryForDay);
    router.get('/display-id/:displayId', auth('UserTask.GetByDisplayId'), controller.getByDisplayId);
    router.get('/:id', auth('UserTask.GetById'), controller.getById);
    router.put('/:id', auth('UserTask.Update'), controller.update);
    router.delete('/:id', auth('UserTask.Delete'), controller.delete);
    router.delete('/users/:userId', auth('UserTask.DeleteFutureTask'), controller.deletePatientFutureTask);

    app.use('/api/v1/user-tasks', router);
};
