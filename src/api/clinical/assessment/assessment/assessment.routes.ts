import express from 'express';
import { Loader } from '../../../../startup/loader';
import { AssessmentController } from './assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new AssessmentController();

    router.post('/:id/start', authenticator.authenticateClient, authenticator.authenticateUser, controller.startAssessment);
    router.get('/:id/score', authenticator.authenticateClient, authenticator.authenticateUser, controller.scoreAssessment);

    router.get('/:id/questions/next', authenticator.authenticateClient, authenticator.authenticateUser, controller.getNextQuestion);
    router.get('/:id/questions/:questionId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getQuestionById);
    router.post('/:id/questions/:questionId/answer', authenticator.authenticateClient, authenticator.authenticateUser, controller.answerQuestion);
    router.post('/:id/question-lists/:listId/answer', authenticator.authenticateClient, authenticator.authenticateUser, controller.answerQuestionList);

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/clinical/assessments/', router);
};
