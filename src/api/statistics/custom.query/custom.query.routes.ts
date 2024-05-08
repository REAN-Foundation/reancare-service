import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CustomQueryController } from './custom.query.controller';
import { CustomQueryAuth } from './custom.query.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CustomQueryController();

    router.post('/', auth(CustomQueryAuth.executeQuery), controller.executeQuery);
    router.get('/search', auth(CustomQueryAuth.search), controller.search);
    router.get('/:id', auth(CustomQueryAuth.getById), controller.getById);
    router.put('/:id', auth(CustomQueryAuth.update), controller.update);
    router.delete('/:id', auth(CustomQueryAuth.delete), controller.delete);

    app.use('/api/v1/custom-query', router);
};
