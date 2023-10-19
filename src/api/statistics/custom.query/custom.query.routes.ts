import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CustomQueryController } from './custom.query.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CustomQueryController();

    router.post('/', auth(), controller.executeQuery);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/custom-query', router);
};
