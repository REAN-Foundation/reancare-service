/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { UserTaskController } from './user.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserTaskController();

    router.get("/categories", auth('User.UserTask.GetCategories', true), controller.getCategories);
    router.get("/action-types", auth('User.UserTask.GetUserActionTypes', true), controller.getUserActionTypes);

    router.post('/', auth('User.UserTask.Create'), controller.create);
    router.get('/search', auth('User.UserTask.Search'), controller.search);

    router.put("/:id/start", auth('User.UserTask.StartTask'), controller.startTask);
    router.put("/:id/finish", auth('User.UserTask.FinishTask'), controller.finishTask);
    router.put("/:id/cancel", auth('User.UserTask.CancelTask'), controller.cancelTask);

    router.get("/users/:userId/summary-for-day/:date", auth('User.UserTask.SummaryForDay'), controller.getTaskSummaryForDay);
    router.get('/display-id/:displayId', auth('User.UserTask.GetByDisplayId'), controller.getByDisplayId);
    router.get('/:id', auth('User.UserTask.GetById'), controller.getById);
    router.put('/:id', auth('User.UserTask.Update'), controller.update);
    router.delete('/:id', auth('User.UserTask.Delete'), controller.delete);
    router.delete('/users/:userId', auth('User.UserTask.DeleteFutureTask'), controller.deletePatientFutureTask);

    app.use('/api/v1/user-tasks', router);
};
