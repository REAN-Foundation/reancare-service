import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StepCountController } from './step.count.controller';
import { StepCountAuth } from './step.count.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StepCountController();

    router.post('/', auth(StepCountAuth.create), controller.create);
    router.get('/search', auth(StepCountAuth.search), controller.search);
    router.get('/:id', auth(StepCountAuth.getById), controller.getById);
    router.put('/:id', auth(StepCountAuth.update), controller.update);
    router.delete('/:id', auth(StepCountAuth.delete), controller.delete);

    app.use('/api/v1/wellness/daily-records/step-counts', router);
};
