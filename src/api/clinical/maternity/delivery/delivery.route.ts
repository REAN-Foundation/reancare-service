import express from 'express';
import { DeliveryController } from './delivery.controller';
import { DeliveryAuth } from './delivery.auth';
import { auth } from '../../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DeliveryController();

    router.post('/', auth(DeliveryAuth.create), controller.create);
    router.get('/search', auth (DeliveryAuth.search),controller.search);
    router.get('/:id', auth(DeliveryAuth.getById),controller.getById);
    router.put('/:id', auth(DeliveryAuth.update),controller.update);
    router.delete('/:id', auth(DeliveryAuth.delete), controller.delete);

    app.use('/api/v1/clinical/maternity/maternity-deliveries', router);
};
