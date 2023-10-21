import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { AssessmentTemplateController } from '../../../clinical/assessment/assessment.template/assessment.template.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AssessmentTemplateController();

    router.post('/:id/nodes', auth('AssessmentTemplate.AddNode'), controller.addNode);
    router.get('/nodes/search', auth('AssessmentTemplate.SearchNode'), controller.searchNode);
    router.get('/:id/nodes/:nodeId', auth('AssessmentTemplate.GetNode'), controller.getNode);
    router.put('/:id/nodes/:nodeId', auth('AssessmentTemplate.UpdateNode'), controller.updateNode);
    router.delete('/:id/nodes/:nodeId', auth('AssessmentTemplate.DeleteNode'), controller.deleteNode);

    router.post('/:id/scoring-conditions/', auth('AssessmentTemplate.AddScoringCondition'), controller.addScoringCondition);
    router.put('/:id/scoring-conditions/:conditionId', auth('AssessmentTemplate.UpdateScoringCondition'), controller.updateScoringCondition);
    router.get('/:id/scoring-conditions/:conditionId', auth('AssessmentTemplate.GetScoringCondition'), controller.getScoringCondition);
    router.delete('/:id/scoring-conditions/:conditionId', auth('AssessmentTemplate.DeleteScoringCondition'), controller.deleteScoringCondition);

    router.post('/', auth('AssessmentTemplate.Create'), controller.create);
    router.get('/search', auth('AssessmentTemplate.Search'), controller.search);
    router.get('/:id', auth('AssessmentTemplate.GetById'), controller.getById);
    router.put('/:id', auth('AssessmentTemplate.Update'), controller.update);
    router.delete('/:id', auth('AssessmentTemplate.Delete'), controller.delete);

    router.get('/:id/export', auth('AssessmentTemplate.Export'), controller.export);
    router.post('/import-file', auth('AssessmentTemplate.ImportFromFile'), controller.importFromFile);
    router.post('/import-json', auth('AssessmentTemplate.ImportFromJson'), controller.importFromJson);

    app.use('/api/v1/clinical/assessment-templates/', router);
};
