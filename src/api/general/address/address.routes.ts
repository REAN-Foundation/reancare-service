import express from 'express';
import { AddressController } from './address.controller';
import { auth } from '../../../auth/auth.handler';
import { AddressAuth } from './address.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AddressController();

    router.post('/', auth(AddressAuth.create), controller.create);
    router.get('/search', auth(AddressAuth.search), controller.search);
    router.get('/:id', auth(AddressAuth.getById), controller.getById);
    router.put('/:id', auth(AddressAuth.update), controller.update);
    router.delete('/:id', auth(AddressAuth.delete), controller.delete);

    app.use('/api/v1/addresses', router);
};
