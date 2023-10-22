/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { UserTaskController } from './user.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserTaskController();

    router.get("/categories", auth('Users.UserTask.GetCategories', true), controller.getCategories);
    router.get("/action-types", auth('Users.UserTask.GetUserActionTypes', true), controller.getUserActionTypes);

    router.post('/', auth('Users.UserTask.Create'), controller.create);
    router.get('/search', auth('Users.UserTask.Search'), controller.search);

    router.put("/:id/start", auth('Users.UserTask.StartTask'), controller.startTask);
    router.put("/:id/finish", auth('Users.UserTask.FinishTask'), controller.finishTask);
    router.put("/:id/cancel", auth('Users.UserTask.CancelTask'), controller.cancelTask);

    router.get("/users/:userId/summary-for-day/:date", auth('Users.UserTask.SummaryForDay'), controller.getTaskSummaryForDay);
    router.get('/display-id/:displayId', auth('Users.UserTask.GetByDisplayId'), controller.getByDisplayId);
    router.get('/:id', auth('Users.UserTask.GetById'), controller.getById);
    router.put('/:id', auth('Users.UserTask.Update'), controller.update);
    router.delete('/:id', auth('Users.UserTask.Delete'), controller.delete);
    router.delete('/users/:userId', auth('Users.UserTask.DeleteFutureTask'), controller.deletePatientFutureTask);

    app.use('/api/v1/user-tasks', router);
};
