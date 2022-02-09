import express from 'express';
import { Loader } from '../../../../startup/loader';
import { AssessmentTemplateController } from '../../../controllers/clinical/assessment/assessment.template.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new AssessmentTemplateController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    
    router.get('/:id/export', authenticator.authenticateClient, authenticator.authenticateUser, controller.export);
    router.post('/:id/import-file', authenticator.authenticateClient, authenticator.authenticateUser, controller.importFromFile);
    router.post('/:id/import-json', authenticator.authenticateClient, authenticator.authenticateUser, controller.importFromJson);

    app.use('/api/v1/clinical/assessment-templates/', router);
};
