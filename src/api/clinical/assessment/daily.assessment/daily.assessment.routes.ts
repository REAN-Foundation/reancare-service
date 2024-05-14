import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DailyAssessmentController } from './daily.assessment.controller';
import { DailyAssessmentAuth } from './daily.assessment.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DailyAssessmentController();

    router.post('/', auth(DailyAssessmentAuth.create), controller.create);
    router.get('/search', auth(DailyAssessmentAuth.search), controller.search);

    app.use('/api/v1/clinical/daily-assessments', router);
};
