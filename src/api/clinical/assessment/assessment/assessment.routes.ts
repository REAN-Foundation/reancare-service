import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { AssessmentController } from './assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AssessmentController();

    router.post('/:id/start', auth('Clinical.Assessments.Assessment.StartAssessment'), controller.startAssessment);
    router.get('/:id/score', auth('Clinical.Assessments.Assessment.ScoreAssessment'), controller.scoreAssessment);

    router.get('/:id/questions/next', auth('Clinical.Assessments.Assessment.GetNextQuestion'), controller.getNextQuestion);
    router.get('/:id/questions/:questionId', auth('Clinical.Assessments.Assessment.GetQuestionById'), controller.getQuestionById);
    router.post('/:id/questions/:questionId/answer', auth('Clinical.Assessments.Assessment.AnswerQuestion'), controller.answerQuestion);
    router.post('/:id/question-lists/:listId/answer', auth('Clinical.Assessments.Assessment.AnswerQuestionList'), controller.answerQuestionList);

    router.post('/', auth('Clinical.Assessments.Assessment.Create'), controller.create);
    router.get('/search', auth('Clinical.Assessments.Assessment.Search'), controller.search);
    router.get('/:id', auth('Clinical.Assessments.Assessment.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Assessments.Assessment.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Assessments.Assessment.Delete'), controller.delete);

    app.use('/api/v1/clinical/assessments/', router);
};
