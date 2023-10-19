import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { AssessmentController } from './assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AssessmentController();

    router.post('/:id/start', auth(), controller.startAssessment);
    router.get('/:id/score', auth(), controller.scoreAssessment);

    router.get('/:id/questions/next', auth(), controller.getNextQuestion);
    router.get('/:id/questions/:questionId', auth(), controller.getQuestionById);
    router.post('/:id/questions/:questionId/answer', auth(), controller.answerQuestion);
    router.post('/:id/question-lists/:listId/answer', auth(), controller.answerQuestionList);

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/clinical/assessments/', router);
};
