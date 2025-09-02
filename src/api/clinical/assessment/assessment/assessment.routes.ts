import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { AssessmentController } from './assessment.controller';
import { AssessmentAuth } from './assessment.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AssessmentController();

    router.post('/:id/start', auth(AssessmentAuth.startAssessment), controller.startAssessment);
    router.get('/:id/score', auth(AssessmentAuth.scoreAssessment), controller.scoreAssessment);

    router.get('/:id/questions/next', auth(AssessmentAuth.getNextQuestion), controller.getNextQuestion);
    router.get('/:id/questions/:questionId', auth(AssessmentAuth.getQuestionById), controller.getQuestionById);
    router.post('/:id/questions/:questionId/answer', auth(AssessmentAuth.answerQuestion), controller.answerQuestion);
    router.post('/:id/questions/:questionId/skip', auth(AssessmentAuth.skipQuestion), controller.skipQuestion);
    router.post('/:id/question-lists/:listId/answer', auth(AssessmentAuth.answerQuestionList), controller.answerQuestionList);

    router.post('/', auth(AssessmentAuth.create), controller.create);
    router.get('/search', auth(AssessmentAuth.search), controller.search);
    router.get('/:id', auth(AssessmentAuth.getById), controller.getById);
    router.put('/:id', auth(AssessmentAuth.update), controller.update);
    router.delete('/:id', auth(AssessmentAuth.delete), controller.delete);

    app.use('/api/v1/clinical/assessments/', router);
};
