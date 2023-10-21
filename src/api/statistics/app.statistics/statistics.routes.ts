import express from 'express';
import { StatisticsController } from './statistics.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StatisticsController();

    router.get('/users-count', auth('Statistics.GetUsersCount'), controller.getUsersCount);
    router.get('/users-stats', auth('Statistics.GetUsersStats'), controller.getUsersStats);
    router.get('/by-roles', auth('Statistics.GetUsersByRole'), controller.getUsersByRole);
    router.get('/by-genders', auth('Statistics.GetUsersByGender'), controller.getUsersByGender);
    router.get('/by-ages', auth('Statistics.GetUsersByAge'), controller.getUsersByAge);
    router.get('/by-marital-statuses', auth('Statistics.GetUsersByMaritalStatus'), controller.getUsersByMaritalStatus);
    router.get('/by-device-details', auth('Statistics.GetUsersByDeviceDetail'), controller.getUsersByDeviceDetail);
    router.get('/by-enrollments', auth('Statistics.GetUsersByEnrollment'), controller.getUsersByEnrollment);
    router.post('/app-downloads', auth('Statistics.UpdateAppDownloadCount'), controller.updateAppDownloadCount);
    router.get('/app-downloads', auth('Statistics.GetAppDownlodCount'), controller.getAppDownlodCount);
    router.get('/by-countries', auth('Statistics.GetUsersByCountry'), controller.getUsersByCountry);
    router.get('/by-major-ailments', auth('Statistics.GetUsersByMajorAilment'), controller.getUsersByMajorAilment);
    router.get('/by-obesities', auth('Statistics.GetUsersByObesity'), controller.getUsersByObesity);
    router.get('/by-addictions', auth('Statistics.GetUsersByAddiction'), controller.getUsersByAddiction);
    router.get('/by-health-pillars', auth('Statistics.GetUsersByHealthPillar'), controller.getUsersByHealthPillar);
    router.get('/by-biometrics', auth('Statistics.GetUsersByBiometrics'), controller.getUsersByBiometrics);
    router.get('/years', auth('Statistics.GetAllYears'), controller.getAllYears);

    app.use('/api/v1/users-statistics', router);
};
