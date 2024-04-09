import express from 'express';
import { SymptomAssessmentTemplateController } from './symptom.assessment.template.controller';
import { auth } from '../../../../auth/auth.handler';
import { SymptomAssessmentTemplateAuth } from './symptom.assessment.template.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomAssessmentTemplateController();

    router.post('/', auth(SymptomAssessmentTemplateAuth.create), controller.create);
    router.get('/search', auth(SymptomAssessmentTemplateAuth.search), controller.search);
    router.get('/:id', auth(SymptomAssessmentTemplateAuth.getById), controller.getById);
    router.put('/:id', auth(SymptomAssessmentTemplateAuth.update), controller.update);
    router.delete('/:id', auth(SymptomAssessmentTemplateAuth.delete), controller.delete);

    router.post("/:id/add-symptom-types", auth(SymptomAssessmentTemplateAuth.addSymptomTypes), controller.addSymptomTypes);
    router.post("/:id/remove-symptom-types", auth(SymptomAssessmentTemplateAuth.removeSymptomTypes), controller.removeSymptomTypes);

    app.use('/api/v1/clinical/symptom-assessment-templates', router);
};
