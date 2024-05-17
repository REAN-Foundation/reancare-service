import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { SleepController } from './sleep.controller';
import { SleepAuth } from './sleep.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SleepController();

    router.post('/', auth(SleepAuth.create), controller.create);
    router.get('/search', auth(SleepAuth.search), controller.search);
    router.get('/:id', auth(SleepAuth.getById), controller.getById);
    router.put('/:id', auth(SleepAuth.update), controller.update);
    router.delete('/:id', auth(SleepAuth.delete), controller.delete);

    app.use('/api/v1/wellness/daily-records/sleep', router);
};
