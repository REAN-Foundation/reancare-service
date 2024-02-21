import { inject, injectable } from "tsyringe";
import { IStatisticsRepo } from "../../database/repository.interfaces/statistics/statistics.repo.interface";
import { AppDownloadDto } from "../../domain.types/statistics/app.download.dto";
import { AppDownloadDomainModel } from "../../domain.types/statistics/app.download.domain.model";
import { StatisticSearchFilters } from "../../domain.types/statistics/statistics.search.type";
import { YearWiseAddictionDistributionDetails, YearWiseAgeDetails, YearWiseCountryDetails, YearWiseDeviceDetails, YearWiseGenderDetails, YearWiseMajorAilmentDistributionDetails, YearWiseMaritalDetails, YearWiseUsers } from "../../domain.types/statistics/daily.statistics/daily.statistics.dto";
import { IDailyStatisticsRepo } from "../../database/repository.interfaces/statistics/daily.statistics.repo.interface";
import { Logger } from "../../common/logger";
import { DailySystemStatisticsDomainModel } from "../../domain.types/statistics/daily.statistics/daily.statistics.domain.model";
import { TimeHelper } from "../../common/time.helper";

////////////////////////////////////////////////////////////////////////////////////////////////////////
//TODO: Convert all ORM dependent methods used and implemented here to SQL queries for performance reasons.
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

    createSystemDashboardStats = async (): Promise<any> => {
        try {
            const filter = {};
            const usersCountStats = await this._statisticsRepo.getUsersCount(filter);
            const deviceDetailWiseUsers = await this._statisticsRepo.getUsersByDeviceDetail(filter);
            const appDownload = await this._statisticsRepo.getAppDownlodCount();
            const allYears = await this._statisticsRepo.getAllYears();
            const yearWiseUserCount = await this._statisticsRepo.getYearWiseUserCount(filter);
            yearWiseUserCount.sort(this.compare);
            const yearWiseDeviceDetails = await this._statisticsRepo.getYearWiseDeviceDetails(filter);
            yearWiseDeviceDetails.sort(this.compare);

            const yearWiseAgeDetails = await this.getYearWiseAgeDetails(allYears);
            const ageWiseUsers = await this._statisticsRepo.getUsersByAge(filter);
            
            const yearWiseGenderDetails = await this._statisticsRepo.getYearWiseGenderDetails(filter);
            const genderWiseUsers = await this._statisticsRepo.getUsersByGender(filter);

            const yearWiseMaritalDetails = await this._statisticsRepo.getYearWiseMaritalDetails(filter);
            const maritalStatusWiseUsers = await this._statisticsRepo.getUsersByMaritalStatus(filter);

            const yearWiseCountryDetails = await this.getYearWiseCountryDetails(allYears);
            const countryWiseUsers = await this._statisticsRepo.getUsersByCountry(filter);

            const yearWiseMajorAilmentDistributionDetails =
            await this._statisticsRepo.getYearWiseMajorAilmentDistributionDetails(filter);
            const majorAilmentDistribution = await this._statisticsRepo.getUsersByMajorAilment(filter);

            const yearWiseAddictionDistributionDetails =
            await this._statisticsRepo.getYearWiseAddictionDistributionDetails(filter);
            const addictionDistribution  = await this._statisticsRepo.getUsersByAddiction(filter);

            const dashboardStats = {
                UserStatistics : {
                    UsersCountStats                         : usersCountStats,
                    DeviceDetailWiseUsers                   : deviceDetailWiseUsers,
                    AppDownload                             : appDownload,
                    YearWiseUserCount                       : yearWiseUserCount,
                    YearWiseDeviceDetails                   : yearWiseDeviceDetails,
                    YearWiseAgeDetails                      : yearWiseAgeDetails,
                    AgeWiseUsers                            : ageWiseUsers,
                    YearWiseGenderDetails                   : yearWiseGenderDetails,
                    GenderWiseUsers                         : genderWiseUsers,
                    YearWiseMaritalDetails                  : yearWiseMaritalDetails,
                    MaritalStatusWiseUsers                  : maritalStatusWiseUsers,
                    YearWiseCountryDetails                  : yearWiseCountryDetails,
                    CountryWiseUsers                        : countryWiseUsers,
                    YearWiseMajorAilmentDistributionDetails : yearWiseMajorAilmentDistributionDetails,
                    MajorAilmentDistribution                : majorAilmentDistribution,
                    YearWiseAddictionDistributionDetails    : yearWiseAddictionDistributionDetails,
                    AddictionDistribution                   : addictionDistribution
                },
            };

            const model: DailySystemStatisticsDomainModel = {
                ReportDate      : TimeHelper.formatDateToLocal_YYYY_MM_DD(new Date()),
                ReportTimestamp : new Date(),
                DashboardStats  : JSON.stringify(dashboardStats)
            };

            const dailyStats = await this._dailyStatisticsRepo.addDailySystemStats(model);
            if (!dailyStats) {
                Logger.instance().log(`Error in creating dashboard statistics`);
            }
            return dailyStats;

        } catch (error) {
            Logger.instance().log(`Error in creating dashboard statistics:${error.message}`);
        }
    };

    createTenantDashboardStats = async (tenantId: string): Promise<any> => {
        try {
            const filter = { TenantId: tenantId };
            //TODO: Add Tenant Specific Statistics Extraction menthods and call them here...
            // All methods should directly use SQL queries rather than ORM for performance reasons.

            const usersCountStats = await this._statisticsRepo.getUsersCount(filter);

            const deviceDetailWiseUsers = await this._statisticsRepo.getUsersByDeviceDetail(filter);

            const allYears = await this._statisticsRepo.getAllYears();

            const yearWiseUserCount = await this._statisticsRepo.getYearWiseUserCount(filter);

            const yearWiseDeviceDetails = await this._statisticsRepo.getYearWiseDeviceDetails(filter);

            const yearWiseAgeDetails = await this._statisticsRepo.getYearWiseAgeDetails(filter);
            const ageWiseUsers = await this._statisticsRepo.getUsersByAge(filter);
            
            const yearWiseGenderDetails = await this._statisticsRepo.getYearWiseGenderDetails(filter);
            const genderWiseUsers = await this._statisticsRepo.getUsersByGender(filter);

            const yearWiseMaritalDetails = await this._statisticsRepo.getYearWiseMaritalDetails(filter);
            const maritalStatusWiseUsers = await this._statisticsRepo.getUsersByMaritalStatus(filter);

            // const yearWiseCountryDetails = await this.getYearWiseCountryDetails(allYears);
            // const countryWiseUsers = await this._statisticsRepo.getUsersByCountry(filter);

            const yearWiseMajorAilmentDistributionDetails =
            await this._statisticsRepo.getYearWiseMajorAilmentDistributionDetails(filter);
            const majorAilmentDistribution = await this._statisticsRepo.getUsersByMajorAilment(filter);

            const yearWiseAddictionDistributionDetails =
            await this._statisticsRepo.getYearWiseAddictionDistributionDetails(filter);
            const addictionDistribution  = await this._statisticsRepo.getUsersByAddiction(filter);

            const dashboardStats = {
                UserStatistics : {
                    UsersCountStats                         : usersCountStats,
                    DeviceDetailWiseUsers                   : deviceDetailWiseUsers,
                    YearWiseUserCount                       : yearWiseUserCount,
                    YearWiseDeviceDetails                   : yearWiseDeviceDetails,
                    YearWiseAgeDetails                      : yearWiseAgeDetails,
                    AgeWiseUsers                            : ageWiseUsers,
                    YearWiseGenderDetails                   : yearWiseGenderDetails,
                    GenderWiseUsers                         : genderWiseUsers,
                    YearWiseMaritalDetails                  : yearWiseMaritalDetails,
                    MaritalStatusWiseUsers                  : maritalStatusWiseUsers,
                    // YearWiseCountryDetails                  : yearWiseCountryDetails,
                    // CountryWiseUsers                        : countryWiseUsers,
                    YearWiseMajorAilmentDistributionDetails : yearWiseMajorAilmentDistributionDetails,
                    MajorAilmentDistribution                : majorAilmentDistribution,
                    YearWiseAddictionDistributionDetails    : yearWiseAddictionDistributionDetails,
                    AddictionDistribution                   : addictionDistribution
                },
            };

            return dashboardStats;

        } catch (error) {
            Logger.instance().log(`Error in creating dashboard statistics:${error.message}`);
        }
    };
    
    private getYearWiseAgeDetails = async(allYears) => {
        const yearWiseAgeDetails: YearWiseAgeDetails[] = [];
        for (let i = 0; i < allYears.length; i++) {
            const ageDetails: YearWiseAgeDetails = {};
            ageDetails.Year = allYears[i]._previousDataValues.year ? allYears[i]._previousDataValues.year : null;
            if (ageDetails.Year) {
                const yearWiseAgeDetails =
                await this._statisticsRepo.getUsersByAge({ Year: ageDetails.Year });
                ageDetails.AgeDetails = yearWiseAgeDetails;
            }
            if (ageDetails.Year) {
                yearWiseAgeDetails.push(ageDetails);
            }
        }
        return yearWiseAgeDetails;
    };

    private getYearWiseCountryDetails = async(allYears) => {
        const yearWiseCountryDetails: YearWiseCountryDetails[] = [];
        for (let i = 0; i < allYears.length; i++) {
            const countryDetails: YearWiseCountryDetails = {};
            countryDetails.Year = allYears[i]._previousDataValues.year ? allYears[i]._previousDataValues.year : null;
            if (countryDetails.Year) {
                const yearWiseCountryDetails =
                await this._statisticsRepo.getUsersByCountry({ Year: countryDetails.Year });
                countryDetails.CountryDetails = yearWiseCountryDetails;
            }
            if (countryDetails.Year) {
                yearWiseCountryDetails.push(countryDetails);
            }
        }
        return yearWiseCountryDetails;
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
