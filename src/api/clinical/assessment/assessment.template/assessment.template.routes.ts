import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { AssessmentTemplateController } from '../../../clinical/assessment/assessment.template/assessment.template.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AssessmentTemplateController();

    router.post('/:id/nodes', auth(), controller.addNode);
    router.get('/nodes/search', auth(), controller.searchNode);
    router.get('/:id/nodes/:nodeId', auth(), controller.getNode);
    router.put('/:id/nodes/:nodeId', auth(), controller.updateNode);
    router.delete('/:id/nodes/:nodeId', auth(), controller.deleteNode);

    router.post('/:id/scoring-conditions/', auth(), controller.addScoringCondition);
    router.put('/:id/scoring-conditions/:conditionId', auth(), controller.updateScoringCondition);
    router.get('/:id/scoring-conditions/:conditionId', auth(), controller.getScoringCondition);
    router.delete('/:id/scoring-conditions/:conditionId', auth(), controller.deleteScoringCondition);

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    router.get('/:id/export', auth(), controller.export);
    router.post('/import-file', auth(), controller.importFromFile);
    router.post('/import-json', auth(), controller.importFromJson);

    app.use('/api/v1/clinical/assessment-templates/', router);
};
