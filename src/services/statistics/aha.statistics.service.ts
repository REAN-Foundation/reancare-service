import { inject, injectable } from "tsyringe";
import { IAhaStatisticsRepo } from "../../database/repository.interfaces/statistics/aha.statistics.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaStatisticsService {

    constructor(
        @inject('IAhaStatisticsRepo') private _ahaStatisticsRepo: IAhaStatisticsRepo,
    ) {}

    getAhaStatistics = async() => {
        const totalPatientCount =  await this._ahaStatisticsRepo.getTotalPatients();
        const usersWithMissingDeviceDetails = await this._ahaStatisticsRepo.getUsersWithMissingDeviceDetails();
        const uniqueUsersInDeviceDetails = await this._ahaStatisticsRepo.getUniqueUsersInDeviceDetails();
        const hsUserCount = await this._ahaStatisticsRepo.getHSUserCount();
        const usersLoggedCountToHSAndHF = await this._ahaStatisticsRepo.getUsersLoggedCountToHSAndHF();
        return {
            TotalPatientCount             : totalPatientCount,
            UsersWithMissingDeviceDetails : usersWithMissingDeviceDetails,
            UniqueUsersInDeviceDetails    : uniqueUsersInDeviceDetails,
            HSUserCount                   : hsUserCount,
            UsersLoggedCountToHSAndHF     : usersLoggedCountToHSAndHF
        };
    };

}
