import express from 'express';
import { ConsentController } from './consent.controller';
import { auth } from '../../../auth/auth.handler';
import { ConsentAuth } from './consent.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ConsentController();

    router.post('/', auth(ConsentAuth.create), controller.create);
    router.put('/:id', auth(ConsentAuth.update), controller.update);
    router.delete('/:id', auth(ConsentAuth.delete), controller.delete);
    router.get('/search', auth(ConsentAuth.search), controller.search);
    router.get('/:id', auth(ConsentAuth.getById), controller.getById);

    app.use('/api/v1/consents', router);
};
