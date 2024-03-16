import express from 'express';
import { auth } from '../../../../../auth/auth.handler';
import { HealthReportSettingController } from './health.report.setting.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthReportSettingController();

    router.post('/', auth('User.Patient.Statistics.CreateReportSettings'), controller.create);
    router.get('/:patientUserId/settings', auth('User.Patient.Statistics.GetReportSettingsByUserId'), controller.getByUserId);
    router.put('/:patientUserId', auth('User.Patient.Statistics.UpdateReportSettingsByUserId'), controller.updateByUserId);
 
    app.use('/api/v1/patient-statistics/health-report', router);
};
