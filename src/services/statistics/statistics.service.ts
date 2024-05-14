import { inject, injectable } from "tsyringe";
import { IStatisticsRepo } from "../../database/repository.interfaces/statistics/statistics.repo.interface";
import { AppDownloadDto } from "../../domain.types/statistics/app.download.dto";
import { AppDownloadDomainModel } from "../../domain.types/statistics/app.download.domain.model";
import { StatisticSearchFilters } from "../../domain.types/statistics/statistics.search.type";
import { IDailyStatisticsRepo } from "../../database/repository.interfaces/statistics/daily.statistics.repo.interface";
import { Logger } from "../../common/logger";
import path from "path";
import { exportStatsReportToPDF } from "./tenant.stats.report/report.generator";
import { FileResourceDto } from "../../domain.types/general/file.resource/file.resource.dto";
import { TimeHelper } from "../../common/time.helper";
import { DateStringFormat } from "../../domain.types/miscellaneous/time.types";
import { FileResourceService } from "../general/file.resource.service";
import { Injector } from "../../startup/injector";
import { exportStatsChartReportToPDF } from "./tenant.stats.report/chart.report.generator";
import { createUsersAgeTrendCharts, createUsersGenderTrendCharts, createYearWiseUserTrendCharts } from "./chart/user.chart";
import { DatabaseSchemaType } from "../../common/database.utils/database.config";

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
            await this._statisticsRepo.createConnection(DatabaseSchemaType.Primary);
            const usersCountStats = await this._statisticsRepo.getUsersCount(filter);
            const deviceDetailWiseUsers = await this._statisticsRepo.getUsersByDeviceDetail(filter);
            const allYears = await this._statisticsRepo.getAllYears();
            const yearWiseUserCount = await this._statisticsRepo.getYearWiseUserCount(filter);
            const yearWiseDeviceDetails = await this._statisticsRepo.getYearWiseDeviceDetails(filter, yearWiseUserCount);

            const yearWiseAgeDetails = await this._statisticsRepo.getYearWiseAgeDetails(allYears);
            const ageWiseUsers = await this._statisticsRepo.getUsersByAge(filter);
            
            const yearWiseGenderDetails = await this._statisticsRepo.getYearWiseGenderDetails(filter);
            const genderWiseUsers = await this._statisticsRepo.getUsersByGender(filter);

            const yearWiseMaritalDetails = await this._statisticsRepo.getYearWiseMaritalDetails(filter);
            const maritalStatusWiseUsers = await this._statisticsRepo.getUsersByMaritalStatus(filter);

            const yearWiseMajorAilmentDistributionDetails =
            await this._statisticsRepo.getYearWiseMajorAilmentDistributionDetails(filter);
            const majorAilmentDistribution = await this._statisticsRepo.getUsersByMajorAilment(filter);

            const yearWiseAddictionDistributionDetails =
            await this._statisticsRepo.getYearWiseAddictionDistributionDetails(filter, yearWiseUserCount);
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

    createTenantDashboardStats = async (tenantId: string): Promise<any> => {
        try {
            const filter = { TenantId: tenantId };
            await this._statisticsRepo.createConnection(DatabaseSchemaType.Primary);
            const usersCountStats = await this._statisticsRepo.getUsersCount(filter);

            const deviceDetailWiseUsers = await this._statisticsRepo.getUsersByDeviceDetail(filter);

            const yearWiseUserCount = await this._statisticsRepo.getYearWiseUserCount(filter);

            const yearWiseDeviceDetails = await this._statisticsRepo.getYearWiseDeviceDetails(filter, yearWiseUserCount);

            const yearWiseAgeDetails = await this._statisticsRepo.getYearWiseAgeDetails(filter);
            const ageWiseUsers = await this._statisticsRepo.getUsersByAge(filter);
            
            const yearWiseGenderDetails = await this._statisticsRepo.getYearWiseGenderDetails(filter);
            const genderWiseUsers = await this._statisticsRepo.getUsersByGender(filter);

            const yearWiseMaritalDetails = await this._statisticsRepo.getYearWiseMaritalDetails(filter);
            const maritalStatusWiseUsers = await this._statisticsRepo.getUsersByMaritalStatus(filter);

            const yearWiseMajorAilmentDistributionDetails =
            await this._statisticsRepo.getYearWiseMajorAilmentDistributionDetails(filter);
            const majorAilmentDistribution = await this._statisticsRepo.getUsersByMajorAilment(filter);

            const yearWiseAddictionDistributionDetails =
            await this._statisticsRepo.getYearWiseAddictionDistributionDetails(filter, yearWiseUserCount);
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

    generateStatsReport = async (reportModel: any) => {
        try {
            return await exportStatsReportToPDF(reportModel);
        } catch (error) {
            Logger.instance().log(`Error in creating stats report in pdf :${error.message}`);
        }
    };

    public generateChartImages = async (
        reportModel: any): Promise<any> => {

        const chartImagePaths = [];
        let imageLocations = await createYearWiseUserTrendCharts(reportModel.YearWiseUserCount);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createUsersAgeTrendCharts(reportModel.AgeWiseUsers);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createUsersGenderTrendCharts(reportModel.GenderWiseUsers);
        chartImagePaths.push(...imageLocations);
        return chartImagePaths;
    };
    
    generateStatsChartReport = async (reportModel: any) => {
        try {
            const chartImagePaths = await this.generateChartImages(reportModel);
            return await exportStatsChartReportToPDF(reportModel, chartImagePaths);
        } catch (error) {
            Logger.instance().log(`Error in creating stats report in pdf :${error.message}`);
        }
    };

    uploadFile = async (sourceLocation: string): Promise<FileResourceDto> => {
        try {
            const filename = path.basename(sourceLocation);
            const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
            const storageKey = `resources/${dateFolder}/${filename}`;
            const fileResourceService = Injector.Container.resolve(FileResourceService);
            return await fileResourceService.uploadLocal(sourceLocation, storageKey, true);
        } catch (error) {
            Logger.instance().log(`Error in uploading pdf :${error.message}`);
        }
        
    };

}
