/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CustomTaskController } from './custom.task.controller';
import { CustomTaskAuth } from './custom.task.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CustomTaskController();

    router.post('/', auth(CustomTaskAuth.create), controller.create);
    router.put("/:id", auth(CustomTaskAuth.update), controller.update);
    router.get('/:id', auth(CustomTaskAuth.getById), controller.getById);

    app.use('/api/v1/custom-tasks', router);
};
