import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { SymptomAssessmentController } from './symptom.assessment.controller';
import { SymptomAssessmentAuth } from './symptom.assessment.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomAssessmentController();

    router.post('/', auth(SymptomAssessmentAuth.create), controller.create);
    router.get('/search', auth(SymptomAssessmentAuth.search), controller.search);
    router.get('/:id', auth(SymptomAssessmentAuth.getById), controller.getById);
    router.put('/:id', auth(SymptomAssessmentAuth.update), controller.update);
    router.delete('/:id', auth(SymptomAssessmentAuth.delete), controller.delete);

    app.use('/api/v1/clinical/symptom-assessments', router);
};
