import express from 'express';
import { Loader } from '../../../../startup/loader';
import { AssessmentTemplateController } from '../../../clinical/assessment/assessment.template/assessment.template.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new AssessmentTemplateController();

    router.post('/:id/nodes', authenticator.authenticateClient, authenticator.authenticateUser, controller.addNode);
    router.get('/nodes/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.searchNode);
    router.get('/:id/nodes/:nodeId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getNode);
    router.put('/:id/nodes/:nodeId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateNode);
    router.delete('/:id/nodes/:nodeId', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteNode);

    router.post('/:id/scoring-conditions/', authenticator.authenticateClient, authenticator.authenticateUser, controller.addScoringCondition);
    router.put('/:id/scoring-conditions/:conditionId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateScoringCondition);
    router.get('/:id/scoring-conditions/:conditionId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getScoringCondition);
    router.delete('/:id/scoring-conditions/:conditionId', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteScoringCondition);

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    router.get('/:id/export', authenticator.authenticateClient, authenticator.authenticateUser, controller.export);
    router.post('/import-file', authenticator.authenticateClient, authenticator.authenticateUser, controller.importFromFile);
    router.post('/import-json', authenticator.authenticateClient, authenticator.authenticateUser, controller.importFromJson);

    app.use('/api/v1/clinical/assessment-templates/', router);
};
