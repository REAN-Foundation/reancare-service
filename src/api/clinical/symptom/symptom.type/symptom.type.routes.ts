import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { SymptomTypeController } from '../../../clinical/symptom/symptom.type/symptom.type.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomTypeController();

    router.post('/', auth('Clinical.Symptoms.SymptomType.Create'), controller.create);
    router.get('/search', auth('Clinical.Symptoms.SymptomType.Search'), controller.search);
    router.get('/:id', auth('Clinical.Symptoms.SymptomType.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Symptoms.SymptomType.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Symptoms.SymptomType.Delete'), controller.delete);

    app.use('/api/v1/clinical/symptom-types', router);
};
