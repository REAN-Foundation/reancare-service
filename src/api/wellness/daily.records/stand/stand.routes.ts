import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StandController } from './stand.controller';
import { StandAuth } from './stand.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StandController();

    router.post('/', auth(StandAuth.create), controller.create);
    router.get('/search', auth(StandAuth.search), controller.search);
    router.get('/:id', auth(StandAuth.getById), controller.getById);
    router.put('/:id', auth(StandAuth.update), controller.update);
    router.delete('/:id', auth(StandAuth.delete), controller.delete);

    app.use('/api/v1/wellness/daily-records/stand', router);
};
