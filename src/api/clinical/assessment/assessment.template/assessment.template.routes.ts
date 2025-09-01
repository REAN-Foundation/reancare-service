import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { AssessmentTemplateController } from '../../../clinical/assessment/assessment.template/assessment.template.controller';
import { AssessmentTemplateAuth } from '../../../clinical/assessment/assessment.template/assessment.template.auth';
import { fileUploadMiddleware } from '../../../../middlewares/file.upload.middleware';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AssessmentTemplateController();
    fileUploadMiddleware(router);
    
    router.post('/:id/nodes', auth(AssessmentTemplateAuth.addNode), controller.addNode);
    router.get('/nodes/search', auth(AssessmentTemplateAuth.searchNodes), controller.searchNodes);
    router.get('/:id/nodes/:nodeId', auth(AssessmentTemplateAuth.getNode), controller.getNode);
    router.put('/:id/nodes/:nodeId', auth(AssessmentTemplateAuth.updateNode), controller.updateNode);
    router.delete('/:id/nodes/:nodeId', auth(AssessmentTemplateAuth.deleteNode), controller.deleteNode);

    router.post('/:id/nodes/:nodeId/paths/:pathId/set-next-node/:nextNodeId', auth(AssessmentTemplateAuth.setNextNodeToPath), controller.setNextNodeToPath);
    router.post('/:id/nodes/:nodeId/paths/:pathId/conditions', auth(AssessmentTemplateAuth.addPathCondition), controller.addPathCondition);
    router.put('/:id/nodes/:nodeId/paths/:pathId/conditions/:conditionId', auth(AssessmentTemplateAuth.updatePathCondition), controller.updatePathCondition);
    router.get('/:id/nodes/:nodeId/paths/:pathId/conditions/:conditionId', auth(AssessmentTemplateAuth.getPathCondition), controller.getPathCondition);
    router.delete('/:id/nodes/:nodeId/paths/:pathId/conditions/:conditionId', auth(AssessmentTemplateAuth.deletePathCondition), controller.deletePathCondition);
    router.get('/:id/nodes/:nodeId/paths/:pathId/conditions', auth(AssessmentTemplateAuth.getPathConditionsForPath), controller.getPathConditionsForPath);

    router.get('/:id/nodes/:nodeId/paths', auth(AssessmentTemplateAuth.getNodePaths), controller.getNodePaths);
    router.post('/:id/nodes/:nodeId/paths', auth(AssessmentTemplateAuth.addPath), controller.addPath);
    router.put('/:id/nodes/:nodeId/paths/:pathId', auth(AssessmentTemplateAuth.updatePath), controller.updatePath);
    router.get('/:id/nodes/:nodeId/paths/:pathId', auth(AssessmentTemplateAuth.getPath), controller.getPath);
    router.delete('/:id/nodes/:nodeId/paths/:pathId', auth(AssessmentTemplateAuth.deletePath), controller.deletePath);

    router.post('/:id/nodes/:nodeId/options', auth(AssessmentTemplateAuth.addOption), controller.addOption);
    router.put('/:id/nodes/:nodeId/options/:optionId', auth(AssessmentTemplateAuth.updateOption), controller.updatePath);
    router.get('/:id/nodes/:nodeId/options/:optionId', auth(AssessmentTemplateAuth.getOption), controller.getPath);
    router.delete('/:id/nodes/:nodeId/options/:optionId', auth(AssessmentTemplateAuth.deleteOption), controller.deleteOption);
    
    router.post('/:id/scoring-conditions/', auth(AssessmentTemplateAuth.addScoringCondition), controller.addScoringCondition);
    router.put('/:id/scoring-conditions/:conditionId', auth(AssessmentTemplateAuth.updateScoringCondition), controller.updateScoringCondition);
    router.get('/:id/scoring-conditions/:conditionId', auth(AssessmentTemplateAuth.getScoringCondition), controller.getScoringCondition);
    router.delete('/:id/scoring-conditions/:conditionId', auth(AssessmentTemplateAuth.deleteScoringCondition), controller.deleteScoringCondition);

    router.post('/', auth(AssessmentTemplateAuth.create), controller.create);
    router.get('/search', auth(AssessmentTemplateAuth.search), controller.search);
    router.get('/:id', auth(AssessmentTemplateAuth.getById), controller.getById);
    router.put('/:id', auth(AssessmentTemplateAuth.update), controller.update);
    router.delete('/:id', auth(AssessmentTemplateAuth.delete), controller.delete);

    router.get('/:id/export', auth(AssessmentTemplateAuth.export), controller.export);
    router.post('/import-file', auth(AssessmentTemplateAuth.importFromFile), controller.importFromFile);
    router.post('/import-json', auth(AssessmentTemplateAuth.importFromJson), controller.importFromJson);

    app.use('/api/v1/clinical/assessment-templates/', router);
};
