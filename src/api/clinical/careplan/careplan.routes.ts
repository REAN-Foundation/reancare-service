import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CareplanController } from './careplan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CareplanController();

    router.get('/eligibility/:patientUserId/providers/:provider/careplans/:careplanCode', auth('Clinical.Careplan.GetPatientEligibility'), controller.getPatientEligibility);
    router.get('/', auth('Clinical.Careplan.GetAvailableCareplans'), controller.getAvailableCareplans);
    router.post('/patients/:patientUserId/enroll', auth('Clinical.Careplan.Enroll'), controller.enroll);
    router.get('/patients/:patientUserId/enrollments', auth('Clinical.Careplan.GetPatientEnrollments'), controller.getPatientEnrollments);
    router.get('/:id/fetch-tasks', auth('Clinical.Careplan.FetchTasks'), controller.fetchTasks);
    router.get('/:id/weekly-status', auth('Clinical.Careplan.GetWeeklyStatus'), controller.getWeeklyStatus);
    router.post('/patients/update-risk', auth('Clinical.Careplan.UpdateRisk'), controller.updateRisk);

    app.use('/api/v1/care-plans', router);
};
