import express from 'express';
import { Loader } from '../../../../startup/loader';
import { AssessmentController } from './assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new AssessmentController();

    router.post('/:id/start', authenticator.authenticateUser, controller.startAssessment);
    router.get('/:id/score', authenticator.authenticateUser, controller.scoreAssessment);

    router.get('/:id/questions/next', authenticator.authenticateUser, controller.getNextQuestion);
    router.get('/:id/questions/:questionId', authenticator.authenticateUser, controller.getQuestionById);
    router.post('/:id/questions/:questionId/answer', authenticator.authenticateUser, controller.answerQuestion);
    router.post('/:id/question-lists/:listId/answer', authenticator.authenticateUser, controller.answerQuestionList);

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/clinical/assessments/', router);
};
