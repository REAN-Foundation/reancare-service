import express from 'express';
import { SymptomAssessmentTemplateController } from '../../../clinical/symptom/symptom.assessment.template/symptom.assessment.template.controller';
import { auth } from '../../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomAssessmentTemplateController();

    router.post('/', auth('SymptomAssessmentTemplate.Create'), controller.create);
    router.get('/search', auth('SymptomAssessmentTemplate.search'), controller.search);
    router.get('/:id', auth('SymptomAssessmentTemplate.GetById'), controller.getById);
    router.put('/:id', auth('SymptomAssessmentTemplate.Update'), controller.update);
    router.delete('/:id', auth('SymptomAssessmentTemplate.Delete'), controller.delete);

    router.post("/:id/add-symptom-types", auth('SymptomAssessmentTemplate.AddSymptomTypes'), controller.addSymptomTypes);
    router.post("/:id/remove-symptom-types", auth('SymptomAssessmentTemplate.RemoveSymptomTypes'), controller.removeSymptomTypes);

    app.use('/api/v1/clinical/symptom-assessment-templates', router);
};
