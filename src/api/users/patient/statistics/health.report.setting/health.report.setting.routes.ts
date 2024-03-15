import express from 'express';
import { auth } from '../../../../../auth/auth.handler';
import { HealthReportSettingController } from './health.report.setting.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthReportSettingController();

    router.post('/', auth('User.Patient.Patient.Statistics.Report.Create', true), controller.create);
    router.get('/:patientUserId/settings', auth('User.Patient.Patient.Statistics.Report.GetByUserId', true), controller.getByUserId);
    router.put('/:patientUserId', auth('User.Patient.Patient.Statistics.Report.UpdateByUserId', true), controller.updateByUserId);
 
    app.use('/api/v1/patient-statistics/health-report', router);
};
