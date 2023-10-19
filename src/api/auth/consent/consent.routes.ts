import express from 'express';
import { ConsentController } from './consent.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ConsentController();

    router.post('/', auth(), controller.create);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);
    router.get('/search', auth(), controller.search);

    router.get('/:id', auth(), controller.getById);

    app.use('/api/v1/consents', router);
};
