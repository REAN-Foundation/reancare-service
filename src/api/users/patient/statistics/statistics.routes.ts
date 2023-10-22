import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { StatisticsController } from './statistics.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StatisticsController();

    router.get('/:patientUserId/report', auth('Users.Patients.Statistics.GetPatientStatsReport'), controller.getPatientStatsReport);
    router.get('/:patientUserId', auth('Users.Patients.Statistics.GetPatientStats', true), controller.getPatientStats);

    app.use('/api/v1/patient-statistics', router);
};
