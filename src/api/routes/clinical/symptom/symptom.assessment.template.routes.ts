import express from 'express';
import { SymptomAssessmentTemplateController } from '../../../controllers/clinical/symptom/symptom.assessment.template.controller';
import { Loader } from '../../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new SymptomAssessmentTemplateController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    
    router.post("/:id/add-symptom-types", authenticator.authenticateClient, authenticator.authenticateUser, controller.addSymptomTypes);
    router.post("/:id/remove-symptom-types", authenticator.authenticateClient, authenticator.authenticateUser, controller.removeSymptomTypes);

    app.use('/api/v1/clinicals/symptom-assessment-templates/', router);
};
