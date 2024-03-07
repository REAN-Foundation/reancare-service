import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { DiagnosisController } from './diagnosis.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DiagnosisController();

    router.post('/', auth('Clinical.Diagnosis.Create'), controller.create);
    router.get('/search', auth('Clinical.Diagnosis.Search'), controller.search);
    router.get('/:id', auth('Clinical.Diagnosis.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Diagnosis.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Diagnosis.Delete'), controller.delete);

    app.use('/api/v1/clinical/diagnoses', router);
};
