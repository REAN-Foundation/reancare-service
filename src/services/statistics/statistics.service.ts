import { inject, injectable } from "tsyringe";
import { IStatisticsRepo } from "../../database/repository.interfaces/statistics/statistics.repo.interface";
import { AppDownloadDto } from "../../domain.types/statistics/app.download.dto";
import { AppDownloadDomainModel } from "../../domain.types/statistics/app.download.domain.model";
import { StatisticSearchFilters } from "../../domain.types/statistics/statistics.search.type";
import { YearWiseDeviceDetails, YearWiseUsers } from "../../domain.types/statistics/daily.statistics/daily.statistics.dto";
import { IDailyStatisticsRepo } from "../../database/repository.interfaces/statistics/daily.statistics.repo.interface";
import { DailyStatisticsDomainModel } from "../../domain.types/statistics/daily.statistics/daily.statistics.domain.model";
import { Logger } from "../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StatisticsService {

    constructor(
        @inject('IStatisticsRepo') private _statisticsRepo: IStatisticsRepo,
        @inject('IDailyStatisticsRepo') private _dailyStatisticsRepo: IDailyStatisticsRepo,
    ) {}

    getUsersCount = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersCount(filters);
    };

    getUsersStats = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersStats(filters);
    };

    getUsersByRole = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByRole(filters);
    };

    getUsersByGender = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByGender(filters);
    };

    getUsersByAge = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByAge(filters);
    };

    getUsersByMaritalStatus = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByMaritalStatus(filters);
    };

    getUsersByDeviceDetail = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByDeviceDetail(filters);
    };

    getUsersByEnrollment = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByEnrollment(filters);
    };

    updateAppDownloadCount = async (appDownloadDomainModel: AppDownloadDomainModel ): Promise<AppDownloadDto> => {
        return await this._statisticsRepo.updateAppDownloadCount(appDownloadDomainModel);
    };

    getAppDownlodCount = async (): Promise<any> => {
        return await this._statisticsRepo.getAppDownlodCount();
    };

    getUsersByCountry = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByCountry(filters);
    };

    getUsersByMajorAilment = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByMajorAilment(filters);
    };

    getUsersByObesity = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByObesity(filters);
    };

    getUsersByAddiction = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByAddiction(filters);
    };

    getUsersByHealthPillar = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByHealthPillar(filters);
    };

    getUsersByBiometrics = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByBiometrics(filters);
    };

    getAllYears = async (): Promise<any> => {
        return await this._statisticsRepo.getAllYears();
    };

    createDailyStatistics = async () => {
        try {
            const filter = {};
            const usersCountStats = await this._statisticsRepo.getUsersCount(filter);
            const deviceDetailWiseUsers = await this._statisticsRepo.getUsersByDeviceDetail(filter);
            const appDownload = await this._statisticsRepo.getAppDownlodCount();
            const allYears = await this._statisticsRepo.getAllYears();
            const yearWiseUserCount = await this.getYearWiseUserCount(allYears);
            yearWiseUserCount.sort(this.compare);
            const yearWiseDeviceDetails = await this.getYearWiseDeviceDetails(allYears);
            yearWiseDeviceDetails.sort(this.compare);
            const ageWiseUsers = await this._statisticsRepo.getUsersByAge(filter);
            const genderWiseUsers = await this._statisticsRepo.getUsersByGender(filter);
            const maritalStatusWiseUsers = await this._statisticsRepo.getUsersByMaritalStatus(filter);
            const countryWiseUsers = await this._statisticsRepo.getUsersByCountry(filter);
            const majorAilmentDistribution = await this._statisticsRepo.getUsersByMajorAilment(filter);
            const addictionDistribution  = await this._statisticsRepo.getUsersByAddiction(filter);
           
            const statisticsData = {
                UserStatistics : {
                    UsersCountStats          : usersCountStats,
                    DeviceDetailWiseUsers    : deviceDetailWiseUsers,
                    AppDownload              : appDownload,
                    YearWiseUserCount        : yearWiseUserCount,
                    YearWiseDeviceDetails    : yearWiseDeviceDetails,
                    AgeWiseUsers             : ageWiseUsers,
                    GenderWiseUsers          : genderWiseUsers,
                    MaritalStatusWiseUsers   : maritalStatusWiseUsers,
                    CountryWiseUsers         : countryWiseUsers,
                    MajorAilmentDistribution : majorAilmentDistribution,
                    AddictionDistribution    : addictionDistribution
                },
            };
    
            const dailyStatisticsDomainModel: DailyStatisticsDomainModel = {
                ReportDate      : new Date(),
                ReportTimestamp : new Date(),
                Statistics      : JSON.stringify(statisticsData)
            };
    
            const dailyStatistics = await this._dailyStatisticsRepo.create(dailyStatisticsDomainModel);
            if (dailyStatistics) {
                Logger.instance().log('Daily users stattistics created successfully.');
            } else {
                Logger.instance().log('Error in creating daily users stattistics.');
            }
        } catch (error) {
            Logger.instance().log(`Error in creating daily users stattistics:${error.message}`);
        }
    };

    private getYearWiseUserCount = async (allYears) => {
        const yearWiseUserCount:YearWiseUsers[] = [];
        for (let i = 0; i < allYears.length; i++) {
            const user: YearWiseUsers = {};
            user.Year = allYears[i]._previousDataValues.year ? allYears[i]._previousDataValues.year : null;
            if (user.Year) {
                const yearWiseUserCount = await this._statisticsRepo.getUsersCount({ Year: user.Year });
                user.UserCount = yearWiseUserCount.TotalUsers.Count;
            }
            if (user.Year) {
                yearWiseUserCount.push(user);
            }
        }
        return yearWiseUserCount;
    };

    private getYearWiseDeviceDetails = async(allYears) => {
        const yearWiseDeviceDetails: YearWiseDeviceDetails[] = [];
        for (let i = 0; i < allYears.length; i++) {
            const deviceDetails: YearWiseDeviceDetails = {};
            deviceDetails.Year = allYears[i]._previousDataValues.year ? allYears[i]._previousDataValues.year : null;
            if (deviceDetails.Year) {
                const yearWiseDeviceDetails =
                await this._statisticsRepo.getUsersByDeviceDetail({ Year: deviceDetails.Year });
                deviceDetails.DeviceDetails = yearWiseDeviceDetails;
            }
            if (deviceDetails.Year) {
                yearWiseDeviceDetails.push(deviceDetails);
            }
        }
        return yearWiseDeviceDetails;
    };
    
    private compare = (a,b) => {
        if ( a.Year < b.Year ) {
            return -1;
        }
        if ( a.Year > b.Year ) {
            return 1;
        }
        return 0;
    };

}
