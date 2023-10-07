import express from 'express';
import { StatisticsController } from './statistics.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new StatisticsController();

    router.get('/users-count', authenticator.authenticateUser, controller.getUsersCount);
    router.get('/users-stats', authenticator.authenticateUser, controller.getUsersStats);
    router.get('/by-roles', authenticator.authenticateUser, controller.getUsersByRole);
    router.get('/by-genders', authenticator.authenticateUser, controller.getUsersByGender);
    router.get('/by-ages', authenticator.authenticateUser, controller.getUsersByAge);
    router.get('/by-marital-statuses', authenticator.authenticateUser, controller.getUsersByMaritalStatus);
    router.get('/by-device-details', authenticator.authenticateUser, controller.getUsersByDeviceDetail);
    router.get('/by-enrollments', authenticator.authenticateUser, controller.getUsersByEnrollment);
    router.post('/app-downloads', authenticator.authenticateUser, controller.updateAppDownloadCount);
    router.get('/app-downloads', authenticator.authenticateUser, controller.getAppDownlodCount);
    router.get('/by-countries', authenticator.authenticateUser, controller.getUsersByCountry);
    router.get('/by-major-ailments', authenticator.authenticateUser, controller.getUsersByMajorAilment);
    router.get('/by-obesities', authenticator.authenticateUser, controller.getUsersByObesity);
    router.get('/by-addictions', authenticator.authenticateUser, controller.getUsersByAddiction);
    router.get('/by-health-pillars', authenticator.authenticateUser, controller.getUsersByHealthPillar);
    router.get('/by-biometrics', authenticator.authenticateUser, controller.getUsersByBiometrics);
    router.get('/years', authenticator.authenticateUser, controller.getAllYears);

    app.use('/api/v1/users-statistics', router);
};
