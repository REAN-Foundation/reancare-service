import express from 'express';
import { Loader } from '../../../startup/loader';
import { TestController } from './test.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new TestController();

    router.post('/schedule-monthly-custom-tasks', controller.scheduleMonthlyCustomTasks);
    router.post('/assessment-tasks/:patientUserId/assessment-templates/:templateId', controller.createAssessmentTask);
    router.post('/reports/:patientUserId/assessments/:assessmentId', controller.testReportGeneration);

    app.use('/api/v1/tests', router);
};
