import express from 'express';
import { SymptomController } from './symptom.controller';
import { auth } from '../../../../auth/auth.handler';
import { SymptomAuth } from './symptom.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomController();

    router.post('/', auth(SymptomAuth.create), controller.create);
    router.get('/search', auth(SymptomAuth.search), controller.search);
    router.get('/:id', auth(SymptomAuth.getById), controller.getById);
    router.put('/:id', auth(SymptomAuth.update), controller.update);
    router.delete('/:id', auth(SymptomAuth.delete), controller.delete);

    app.use('/api/v1/clinical/symptoms', router);
};
