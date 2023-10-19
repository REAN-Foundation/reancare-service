import express from 'express';
import { StatisticsController } from './statistics.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StatisticsController();

    router.get('/users-count', auth(), controller.getUsersCount);
    router.get('/users-stats', auth(), controller.getUsersStats);
    router.get('/by-roles', auth(), controller.getUsersByRole);
    router.get('/by-genders', auth(), controller.getUsersByGender);
    router.get('/by-ages', auth(), controller.getUsersByAge);
    router.get('/by-marital-statuses', auth(), controller.getUsersByMaritalStatus);
    router.get('/by-device-details', auth(), controller.getUsersByDeviceDetail);
    router.get('/by-enrollments', auth(), controller.getUsersByEnrollment);
    router.post('/app-downloads', auth(), controller.updateAppDownloadCount);
    router.get('/app-downloads', auth(), controller.getAppDownlodCount);
    router.get('/by-countries', auth(), controller.getUsersByCountry);
    router.get('/by-major-ailments', auth(), controller.getUsersByMajorAilment);
    router.get('/by-obesities', auth(), controller.getUsersByObesity);
    router.get('/by-addictions', auth(), controller.getUsersByAddiction);
    router.get('/by-health-pillars', auth(), controller.getUsersByHealthPillar);
    router.get('/by-biometrics', auth(), controller.getUsersByBiometrics);
    router.get('/years', auth(), controller.getAllYears);

    app.use('/api/v1/users-statistics', router);
};
