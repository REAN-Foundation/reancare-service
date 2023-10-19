import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CareplanController } from './careplan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CareplanController();

    router.get('/eligibility/:patientUserId/providers/:provider/careplans/:careplanCode', auth(), controller.getPatientEligibility);
    router.get('/', auth(), controller.getAvailableCareplans);
    router.post('/patients/:patientUserId/enroll', auth(), controller.enroll);
    router.get('/patients/:patientUserId/enrollments', auth(), controller.getPatientEnrollments);
    router.get('/:id/fetch-tasks', auth(), controller.fetchTasks);
    router.get('/:id/weekly-status', auth(), controller.getWeeklyStatus);
    router.post('/patients/update-risk', auth(), controller.updateRisk);

    app.use('/api/v1/care-plans', router);
};
