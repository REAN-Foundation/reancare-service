import express from 'express';
import { Loader } from '../../../startup/loader';
import { DailyAssessmentController } from './daily.assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new DailyAssessmentController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);

    app.use('/api/v1/clinical/daily-assessments', router);
};
