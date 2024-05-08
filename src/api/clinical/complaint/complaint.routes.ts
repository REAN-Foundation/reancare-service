import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { ComplaintController } from './complaint.controller';
import { ComplaintAuth } from './complaint.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ComplaintController();

    router.post('/', auth(ComplaintAuth.create), controller.create);
    router.get('/search/:id', auth(ComplaintAuth.search), controller.search);
    router.get('/:id', auth(ComplaintAuth.getById), controller.getById);
    router.put('/:id', auth(ComplaintAuth.update), controller.update);
    router.delete('/:id', auth(ComplaintAuth.delete), controller.delete);

    app.use('/api/v1/clinical/complaints', router);
};
