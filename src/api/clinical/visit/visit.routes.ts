/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { VisitController } from './visit.controller';
import { VisitAuth } from './visit.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new VisitController();

    router.post('/', auth(VisitAuth.create), controller.create);
    router.get('/search', auth(VisitAuth.search), controller.search);
    router.get('/:id', auth(VisitAuth.getById), controller.getById);
    router.put('/:id', auth(VisitAuth.update), controller.update);
    router.delete('/:id', auth(VisitAuth.delete), controller.delete);

    app.use('/api/v1/clinical/visits', router);
};
