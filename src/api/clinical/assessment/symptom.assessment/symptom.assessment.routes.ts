import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { SymptomAssessmentController } from './symptom.assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomAssessmentController();

    router.post('/', auth('Clinical.Assessments.SymptomAssessment.Create'), controller.create);
    router.get('/search', auth('Clinical.Assessments.SymptomAssessment.Search'), controller.search);
    router.get('/:id', auth('Clinical.Assessments.SymptomAssessment.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Assessments.SymptomAssessment.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Assessments.SymptomAssessment.Delete'), controller.delete);

    app.use('/api/v1/clinical/symptom-assessments', router);
};
