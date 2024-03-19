import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StatisticsController } from './statistics.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StatisticsController();

    router.get('/:patientUserId/report', auth('User.Patient.Statistics.GetPatientStatsReport'), controller.getPatientStatsReport);
    router.get('/:patientUserId', auth('User.Patient.Statistics.GetPatientStats', true), controller.getPatientStats);
    router.get('/:patientUserId/health-summary', auth('User.Patient.Statistics.GetPatientHealthSummary', true), controller.getPatientHealthSummary);

    router.post('/:patientUserId/settings', auth('User.Patient.Statistics.CreateReportSettings'), controller.createReportSettings);
    router.get('/:patientUserId/settings', auth('User.Patient.Statistics.GetReportSettingsByUserId'), controller.getReportSettingsByUserId);
    router.put('/:patientUserId/settings', auth('User.Patient.Statistics.UpdateReportSettingsByUserId'), controller.updateReportSettingsByUserId);

    app.use('/api/v1/patient-statistics', router);
};
