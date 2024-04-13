/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { OrderController } from './order.controller';
import { OrderAuth } from './order.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new OrderController();

    router.post('/', auth(OrderAuth.create), controller.create);
    router.get('/search', auth(OrderAuth.search), controller.search);
    router.get('/:id', auth(OrderAuth.getById), controller.getById);
    router.put('/:id', auth(OrderAuth.update), controller.update);
    router.delete('/:id', auth(OrderAuth.delete), controller.delete);

    app.use('/api/v1/clinical/orders', router);
};
