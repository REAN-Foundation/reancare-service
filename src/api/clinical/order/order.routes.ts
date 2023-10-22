/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { OrderController } from './order.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new OrderController();

    router.post('/', auth('Clinical.Order.Create'), controller.create);
    router.get('/search', auth('Clinical.Order.Search'), controller.search);
    router.get('/:id', auth('Clinical.Order.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Order.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Order.Delete'), controller.delete);

    app.use('/api/v1/clinical/orders', router);
};
