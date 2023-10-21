import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { DiagnosisController } from './diagnosis.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DiagnosisController();

    router.post('/', auth('Diagnosis.Create'), controller.create);
    router.get('/search', auth('Diagnosis.Search'), controller.search);
    router.get('/:id', auth('Diagnosis.GetById'), controller.getById);
    router.put('/:id', auth('Diagnosis.Update'), controller.update);
    router.delete('/:id', auth('Diagnosis.Delete'), controller.delete);

    app.use('/api/v1/clinical/diagnoses', router);
};
