import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StatisticsController } from './statistics.controller';
import { StatisticsAuth } from './statistics.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StatisticsController();

    router.get('/:patientUserId/report', auth(StatisticsAuth.getPatientStatsReport), controller.getPatientStatsReport);
    router.get('/:patientUserId', auth(StatisticsAuth.getPatientStats), controller.getPatientStats);
    router.get('/:patientUserId/health-summary', auth(StatisticsAuth.getPatientHealthSummary), controller.getPatientHealthSummary);

    router.post('/:patientUserId/settings', auth(StatisticsAuth.createReportSettings), controller.createReportSettings);
    router.get('/:patientUserId/settings', auth(StatisticsAuth.getReportSettingsByUserId), controller.getReportSettingsByUserId);
    router.put('/:patientUserId/settings', auth(StatisticsAuth.updateReportSettingsByUserId), controller.updateReportSettingsByUserId);

    app.use('/api/v1/patient-statistics', router);
};
