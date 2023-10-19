import express from 'express';
import { SymptomAssessmentTemplateController } from '../../../clinical/symptom/symptom.assessment.template/symptom.assessment.template.controller';
import { auth } from '../../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomAssessmentTemplateController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    router.post("/:id/add-symptom-types", auth(), controller.addSymptomTypes);
    router.post("/:id/remove-symptom-types", auth(), controller.removeSymptomTypes);

    app.use('/api/v1/clinical/symptom-assessment-templates', router);
};
