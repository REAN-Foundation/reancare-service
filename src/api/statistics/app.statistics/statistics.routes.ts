import express from 'express';
import { StatisticsController } from './statistics.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new StatisticsController();

    router.get('/users-count', auth('Statistics.AppStats.GetUsersCount'), controller.getUsersCount);
    router.get('/users-stats', auth('Statistics.AppStats.GetUsersStats'), controller.getUsersStats);
    router.get('/by-roles', auth('Statistics.AppStats.GetUsersByRole'), controller.getUsersByRole);
    router.get('/by-genders', auth('Statistics.AppStats.GetUsersByGender'), controller.getUsersByGender);
    router.get('/by-ages', auth('Statistics.AppStats.GetUsersByAge'), controller.getUsersByAge);
    router.get('/by-marital-statuses', auth('Statistics.AppStats.GetUsersByMaritalStatus'), controller.getUsersByMaritalStatus);
    router.get('/by-device-details', auth('Statistics.AppStats.GetUsersByDeviceDetail'), controller.getUsersByDeviceDetail);
    router.post('/app-downloads', auth('Statistics.AppStats.UpdateAppDownloadCount'), controller.updateAppDownloadCount);
    router.get('/app-downloads', auth('Statistics.AppStats.GetAppDownlodCount'), controller.getAppDownlodCount);
    router.get('/by-countries', auth('Statistics.AppStats.GetUsersByCountry'), controller.getUsersByCountry);
    router.get('/by-major-ailments', auth('Statistics.AppStats.GetUsersByMajorAilment'), controller.getUsersByMajorAilment);
    router.get('/by-obesities', auth('Statistics.AppStats.GetUsersByObesity'), controller.getUsersByObesity);
    router.get('/by-addictions', auth('Statistics.AppStats.GetUsersByAddiction'), controller.getUsersByAddiction);
    router.get('/by-health-pillars', auth('Statistics.AppStats.GetUsersByHealthPillar'), controller.getUsersByHealthPillar);
    router.get('/by-biometrics', auth('Statistics.AppStats.GetUsersByBiometrics'), controller.getUsersByBiometrics);
    router.get('/years', auth('Statistics.AppStats.GetAllYears'), controller.getAllYears);

    app.use('/api/v1/users-statistics', router);
};
