import express from 'express';
import { SymptomAssessmentTemplateController } from '../../../clinical/symptom/symptom.assessment.template/symptom.assessment.template.controller';
import { Loader } from '../../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new SymptomAssessmentTemplateController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    router.post("/:id/add-symptom-types", authenticator.authenticateUser, controller.addSymptomTypes);
    router.post("/:id/remove-symptom-types", authenticator.authenticateUser, controller.removeSymptomTypes);

    app.use('/api/v1/clinical/symptom-assessment-templates', router);
};
