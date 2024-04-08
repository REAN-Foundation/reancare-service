import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisAuth } from './diagnosis.auth';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DiagnosisController();

    router.post('/', auth(DiagnosisAuth.create), controller.create);
    router.get('/search', auth(DiagnosisAuth.search), controller.search);
    router.get('/:id', auth(DiagnosisAuth.getById), controller.getById);
    router.put('/:id', auth(DiagnosisAuth.update), controller.update);
    router.delete('/:id', auth(DiagnosisAuth.delete), controller.delete);

    app.use('/api/v1/clinical/diagnoses', router);
};
