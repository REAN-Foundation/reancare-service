import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { SymptomAssessmentController } from '../../../clinical/symptom/symptom.assessment/symptom.assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomAssessmentController();

    router.post('/', auth('SymptomAssessment.Create'), controller.create);
    router.get('/search', auth('SymptomAssessment.Search'), controller.search);
    router.get('/:id', auth('SymptomAssessment.GetById'), controller.getById);
    router.put('/:id', auth('SymptomAssessment.Update'), controller.update);
    router.delete('/:id', auth('SymptomAssessment.Delete'), controller.delete);

    app.use('/api/v1/clinical/symptom-assessments', router);
};
