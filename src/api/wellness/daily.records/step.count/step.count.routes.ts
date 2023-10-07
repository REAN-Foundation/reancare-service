import express from 'express';
import { Loader } from '../../../../startup/loader';
import { StepCountController } from './step.count.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new StepCountController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/wellness/daily-records/step-counts', router);
};
