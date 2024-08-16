import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CareplanController } from './careplan.controller';
import { CareplanAuth } from './careplan.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CareplanController();

    router.get('/eligibility/:patientUserId/providers/:provider/careplans/:careplanCode', auth(CareplanAuth.getPatientEligibility), controller.getPatientEligibility);
    router.get('/', auth(CareplanAuth.getAvailableCareplans), controller.getAvailableCareplans);
    router.post('/patients/:patientUserId/enroll', auth(CareplanAuth.enroll), controller.enroll);
    router.get('/patients/:patientUserId/enrollments', auth(CareplanAuth.getPatientEnrollments), controller.getPatientEnrollments);
    router.get('/patients/:patientUserId/active-enrollments', auth(CareplanAuth.getPatientActiveEnrollments), controller.getPatientActiveEnrollments);
    router.get('/:id/fetch-tasks', auth(CareplanAuth.fetchTasks), controller.fetchTasks);
    router.get('/:id/weekly-status', auth(CareplanAuth.getWeeklyStatus), controller.getWeeklyStatus);
    router.post('/patients/update-risk', auth(CareplanAuth.updateRisk), controller.updateRisk);
    router.post('/:id/stop', auth(CareplanAuth.stop), controller.stop);

    app.use('/api/v1/care-plans', router);
};
