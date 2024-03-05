import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { AssessmentTemplateController } from '../../../clinical/assessment/assessment.template/assessment.template.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AssessmentTemplateController();

    router.post('/:id/nodes', auth('Clinical.Assessments.AssessmentTemplate.AddNode'), controller.addNode);
    router.get('/nodes/search', auth('Clinical.Assessments.AssessmentTemplate.SearchNode'), controller.searchNode);
    router.get('/:id/nodes/:nodeId', auth('Clinical.Assessments.AssessmentTemplate.GetNode'), controller.getNode);
    router.put('/:id/nodes/:nodeId', auth('Clinical.Assessments.AssessmentTemplate.UpdateNode'), controller.updateNode);
    router.delete('/:id/nodes/:nodeId', auth('Clinical.Assessments.AssessmentTemplate.DeleteNode'), controller.deleteNode);

    router.post('/:id/nodes/:nodeId/paths/:pathId/set-next-node/:nextNodeId', auth('Clinical.Assessments.AssessmentTemplate.SetNextNodeToPath'), controller.setNextNodeToPath);
    router.post('/:id/nodes/:nodeId/paths/:pathId/conditions', auth('Clinical.Assessments.AssessmentTemplate.AddPathCondition'), controller.addPathCondition);
    router.put('/:id/nodes/:nodeId/paths/:pathId/conditions/:conditionId', auth('Clinical.Assessments.AssessmentTemplate.UpdatePathCondition'), controller.updatePathCondition);
    router.get('/:id/nodes/:nodeId/paths/:pathId/conditions/:conditionId', auth('Clinical.Assessments.AssessmentTemplate.GetPathCondition'), controller.getPathCondition);
    router.delete('/:id/nodes/:nodeId/paths/:pathId/conditions/:conditionId', auth('Clinical.Assessments.AssessmentTemplate.DeletePathCondition'), controller.deletePathCondition);
    router.get('/:id/nodes/:nodeId/paths/:pathId/conditions', auth('Clinical.Assessments.AssessmentTemplate.GetConditionsForPath'), controller.getPathConditionsForPath);

    router.get('/:id/nodes/:nodeId/paths', auth('Clinical.Assessments.AssessmentTemplate.GetNodePaths'), controller.getNodePaths);
    router.post('/:id/nodes/:nodeId/paths', auth('Clinical.Assessments.AssessmentTemplate.AddPath'), controller.addPath);
    router.put('/:id/nodes/:nodeId/paths/:pathId', auth('Clinical.Assessments.AssessmentTemplate.UpdatePath'), controller.updatePath);
    router.get('/:id/nodes/:nodeId/paths/:pathId', auth('Clinical.Assessments.AssessmentTemplate.GetPath'), controller.getPath);
    router.delete('/:id/nodes/:nodeId/paths/:pathId', auth('Clinical.Assessments.AssessmentTemplate.DeletePath'), controller.deletePath);

    router.post('/:id/scoring-conditions/', auth('Clinical.Assessments.AssessmentTemplate.AddScoringCondition'), controller.addScoringCondition);
    router.put('/:id/scoring-conditions/:conditionId', auth('Clinical.Assessments.AssessmentTemplate.UpdateScoringCondition'), controller.updateScoringCondition);
    router.get('/:id/scoring-conditions/:conditionId', auth('Clinical.Assessments.AssessmentTemplate.GetScoringCondition'), controller.getScoringCondition);
    router.delete('/:id/scoring-conditions/:conditionId', auth('Clinical.Assessments.AssessmentTemplate.DeleteScoringCondition'), controller.deleteScoringCondition);

    router.post('/', auth('Clinical.Assessments.AssessmentTemplate.Create'), controller.create);
    router.get('/search', auth('Clinical.Assessments.AssessmentTemplate.Search'), controller.search);
    router.get('/:id', auth('Clinical.Assessments.AssessmentTemplate.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Assessments.AssessmentTemplate.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Assessments.AssessmentTemplate.Delete'), controller.delete);

    router.get('/:id/export', auth('Clinical.Assessments.AssessmentTemplate.Export'), controller.export);
    router.post('/import-file', auth('Clinical.Assessments.AssessmentTemplate.ImportFromFile'), controller.importFromFile);
    router.post('/import-json', auth('Clinical.Assessments.AssessmentTemplate.ImportFromJson'), controller.importFromJson);

    app.use('/api/v1/clinical/assessment-templates/', router);
};
