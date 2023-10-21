import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { AssessmentController } from './assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AssessmentController();

    router.post('/:id/start', auth('Assessment.StartAssessment'), controller.startAssessment);
    router.get('/:id/score', auth('Assessment.ScoreAssessment'), controller.scoreAssessment);

    router.get('/:id/questions/next', auth('Assessment.GetNextQuestion'), controller.getNextQuestion);
    router.get('/:id/questions/:questionId', auth('Assessment.GetQuestionById'), controller.getQuestionById);
    router.post('/:id/questions/:questionId/answer', auth('Assessment.AnswerQuestion'), controller.answerQuestion);
    router.post('/:id/question-lists/:listId/answer', auth('Assessment.AnswerQuestionList'), controller.answerQuestionList);

    router.post('/', auth('Assessment.Create'), controller.create);
    router.get('/search', auth('Assessment.Search'), controller.search);
    router.get('/:id', auth('Assessment.GetById'), controller.getById);
    router.put('/:id', auth('Assessment.Update'), controller.update);
    router.delete('/:id', auth('Assessment.Delete'), controller.delete);

    app.use('/api/v1/clinical/assessments/', router);
};
