/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { OrderController } from './order.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new OrderController();

    router.post('/', auth('Order.Create'), controller.create);
    router.get('/search', auth('Order.Search'), controller.search);
    router.get('/:id', auth('Order.GetById'), controller.getById);
    router.put('/:id', auth('Order.Update'), controller.update);
    router.delete('/:id', auth('Order.Delete'), controller.delete);

    app.use('/api/v1/clinical/orders', router);
};
