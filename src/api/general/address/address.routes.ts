import express from 'express';
import { AddressController } from './address.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AddressController();

    router.post('/', auth('General.Address.Create'), controller.create);
    router.get('/search', auth('General.Address.Search'), controller.search);
    router.get('/:id', auth('General.Address.GetById'), controller.getById);
    router.put('/:id', auth('General.Address.Update'), controller.update);
    router.delete('/:id', auth('General.Address.Delete'), controller.delete);

    app.use('/api/v1/addresses', router);
};
