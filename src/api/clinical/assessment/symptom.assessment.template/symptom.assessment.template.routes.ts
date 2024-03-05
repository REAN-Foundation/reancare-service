import express from 'express';
import { SymptomAssessmentTemplateController } from './symptom.assessment.template.controller';
import { auth } from '../../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomAssessmentTemplateController();

    router.post('/', auth('Clinical.Assessments.SymptomAssessmentTemplate.Create'), controller.create);
    router.get('/search', auth('Clinical.Assessments.SymptomAssessmentTemplate.Search'), controller.search);
    router.get('/:id', auth('Clinical.Assessments.SymptomAssessmentTemplate.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Assessments.SymptomAssessmentTemplate.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Assessments.SymptomAssessmentTemplate.Delete'), controller.delete);

    router.post("/:id/add-symptom-types", auth('Clinical.Assessments.SymptomAssessmentTemplate.AddSymptomTypes'), controller.addSymptomTypes);
    router.post("/:id/remove-symptom-types", auth('Clinical.Assessments.SymptomAssessmentTemplate.RemoveSymptomTypes'), controller.removeSymptomTypes);

    app.use('/api/v1/clinical/symptom-assessment-templates', router);
};
