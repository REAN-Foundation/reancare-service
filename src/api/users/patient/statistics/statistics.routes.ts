import express from 'express';
import { Loader } from '../../../../startup/loader';
import { StatisticsController } from './statistics.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new StatisticsController();

    router.get('/:patientUserId/report', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPatientStatsReport);
    router.get('/:patientUserId', authenticator.authenticateClient, /*authenticator.authenticateUser,*/ controller.getPatientStats);

    app.use('/api/v1/patient-statistics', router);
};
