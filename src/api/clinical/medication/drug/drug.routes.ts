import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DrugController } from './drug.controller';
import { DrugAuth } from './drug.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DrugController();

    router.post('/', auth(DrugAuth.create), controller.create);
    router.get('/search', auth(DrugAuth.search), controller.search);
    router.get('/:id', auth(DrugAuth.getById), controller.getById);
    router.put('/:id', auth(DrugAuth.update), controller.update);
    router.delete('/:id', auth(DrugAuth.delete), controller.delete);

    app.use('/api/v1/clinical/drugs', router);
};
