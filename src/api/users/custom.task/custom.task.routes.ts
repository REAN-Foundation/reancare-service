/* eslint-disable max-len */
import express from 'express';
import { Loader } from '../../../startup/loader';
import { CustomTaskController } from './custom.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CustomTaskController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.put("/:id", authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);

    app.use('/api/v1/custom-tasks', router);
};
