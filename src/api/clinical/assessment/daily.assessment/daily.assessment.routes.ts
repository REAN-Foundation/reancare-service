import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DailyAssessmentController } from './daily.assessment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DailyAssessmentController();

    router.post('/', auth('Clinical.Assessments.DailyAssessment.Create'), controller.create);
    router.get('/search', auth('Clinical.Assessments.DailyAssessment.Search'), controller.search);

    app.use('/api/v1/clinical/daily-assessments', router);
};
