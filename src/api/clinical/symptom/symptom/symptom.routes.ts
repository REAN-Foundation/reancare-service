import express from 'express';
import { SymptomController } from './symptom.controller';
import { auth } from '../../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomController();

    router.post('/', auth('Clinical.Symptoms.Symptom.Create'), controller.create);
    router.get('/search', auth('Clinical.Symptoms.Symptom.Search'), controller.search);
    router.get('/:id', auth('Clinical.Symptoms.Symptom.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Symptoms.Symptom.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Symptoms.Symptom.Delete'), controller.delete);

    app.use('/api/v1/clinical/symptoms', router);
};
