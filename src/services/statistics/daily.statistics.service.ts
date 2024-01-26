import { inject, injectable } from "tsyringe";
import { IDailyStatisticsRepo } from "../../database/repository.interfaces/statistics/daily.statistics.repo.interface";
import { DailySystemStatisticsDto, DailyTenantStatisticsDto } from "../../domain.types/statistics/daily.statistics/daily.statistics.dto";
import { DailySystemStatisticsDomainModel, DailyTenantStatisticsDomainModel } from "../../domain.types/statistics/daily.statistics/daily.statistics.domain.model";
import { StatisticsService } from "./statistics.service";
import { AhaStatisticsService } from "./aha.stats/aha.statistics.service";
import { TimeHelper } from "../../common/time.helper";
import { DateStringFormat } from "../../domain.types/miscellaneous/time.types";
import { Logger } from "../../common/logger";
import { Injector } from "../../startup/injector";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { StatisticSearchFilters } from "../../domain.types/statistics/statistics.search.type";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DailyStatisticsService {

    constructor(
        @inject('IDailyStatisticsRepo') private _dailyStatisticsRepo: IDailyStatisticsRepo,
    ) {}

    getDailySystemStats = async (): Promise<DailySystemStatisticsDto> => {
        return await this._dailyStatisticsRepo.getDailySystemStats();
    };

    getDailyTenantStats = async (tenantId: uuid): Promise<DailyTenantStatisticsDto> => {
        return await this._dailyStatisticsRepo.getDailyTenantStats(tenantId);
    };

    addDailySystemStats = async (model: DailySystemStatisticsDomainModel): Promise<DailySystemStatisticsDto> => {
        return await this._dailyStatisticsRepo.addDailySystemStats(model);
    };

    addDailyTenantStats = async (model: DailyTenantStatisticsDomainModel): Promise<DailyTenantStatisticsDto> => {
        return await this._dailyStatisticsRepo.addDailyTenantStats(model);
    };

    generateDailyStatistics = async (): Promise<void> => {
        try {
            let pdfModel = null;
            let fileResourceDto = null;

            var statisticsService = Injector.Container.resolve(StatisticsService);
            const dashboardStats = await statisticsService.createSystemDashboardStats();
            var ahaStatisticsService = Injector.Container.resolve(AhaStatisticsService);
            const ahaStats = await ahaStatisticsService.getAhaStatistics();

            if (ahaStats) {
                pdfModel = await ahaStatisticsService.generateAHAStatsReport(ahaStats);
            }

            if (pdfModel) {
                await ahaStatisticsService.sendStatisticsByEmail(pdfModel.absFilepath, pdfModel.filename);
                fileResourceDto = await ahaStatisticsService.uploadFile(pdfModel.absFilepath);
            }

            const resourceId = fileResourceDto ? fileResourceDto.id : null;
            const userStats = await ahaStatisticsService.getUserStatistics();

            const model: DailySystemStatisticsDomainModel = {
                ReportDate      : TimeHelper.getDateString(new Date(),DateStringFormat.YYYY_MM_DD),
                ReportTimestamp : new Date(),
                DashboardStats  : dashboardStats ? JSON.stringify(dashboardStats) : null,
                AHAStats        : ahaStats ? JSON.stringify(ahaStats) : null,
                UserStats       : userStats ? JSON.stringify(userStats) : null,
                ResourceId      : resourceId
            };
            
            if (!model.DashboardStats && !model.AHAStats && !model.UserStats) {
                throw new Error('Unable to generate stats!');
            }
            
            const statsRecord = await this.addDailySystemStats(model);
            if (statsRecord) {
                Logger.instance().log(`Daily stats: ${JSON.stringify(statsRecord)}`);
            }

        } catch (error) {
            Logger.instance().log(`Error generating statistics : ${error.message}`);
        }
    };

    generateDailyTenantStatistics = async (tenantId: uuid): Promise<void> => {
        try {
            const statisticsService = Injector.Container.resolve(StatisticsService);
            const dashboardStats = await statisticsService.createTenantDashboardStats(tenantId);
            const filters: StatisticSearchFilters = { TenantId: tenantId };
            const userStats = await statisticsService.getUsersStats(filters);

            const model: DailyTenantStatisticsDomainModel = {
                ReportDate      : TimeHelper.getDateString(new Date(),DateStringFormat.YYYY_MM_DD),
                ReportTimestamp : new Date(),
                DashboardStats  : dashboardStats ? JSON.stringify(dashboardStats) : null,
                UserStats       : userStats ? JSON.stringify(userStats) : null,
                TenantId        : tenantId
            };
            
            if (!model.DashboardStats && !model.UserStats) {
                throw new Error('Unable to generate stats!');
            }
            
            const statsRecord = await this.addDailyTenantStats(model);
            if (statsRecord) {
                Logger.instance().log(`Daily stats: ${JSON.stringify(statsRecord)}`);
            }

        } catch (error) {
            Logger.instance().log(`Error in creating daily users statistics:${error.message}`);
        }
    };

}


    // ahaStats = {
    //     CareplanStats : [
    //         {
    //             Careplan           : 'Cholesterol',
    //             Enrollments        : 10,
    //             ActiveEnrollments  : 8,
    //             DeletedEnrollments : 2
    //         },
    //         {
    //             Careplan           : 'Stroke',
    //             Enrollments        : 20,
    //             ActiveEnrollments  : 15,
    //             DeletedEnrollments : 5
    //         },
    //         {
    //             Careplan           : 'HeartFailure',
    //             Enrollments        : 35,
    //             ActiveEnrollments  : 30,
    //             DeletedEnrollments : 5
    //         },
    //         {
    //             Careplan           : 'SMBP',
    //             Enrollments        : 50,
    //             ActiveEnrollments  : 40,
    //             DeletedEnrollments : 10
    //         },
    //         {
    //             Careplan           : 'Cholesterol1',
    //             Enrollments        : 10,
    //             ActiveEnrollments  : 8,
    //             DeletedEnrollments : 2
    //         },
    //         {
    //             Careplan           : 'Stroke1',
    //             Enrollments        : 20,
    //             ActiveEnrollments  : 15,
    //             DeletedEnrollments : 5
    //         },
    //         {
    //             Careplan           : 'HeartFailure1',
    //             Enrollments        : 35,
    //             ActiveEnrollments  : 30,
    //             DeletedEnrollments : 5
    //         },
    //         {
    //             Careplan           : 'SMBP1',
    //             Enrollments        : 50,
    //             ActiveEnrollments  : 40,
    //             DeletedEnrollments : 10
    //         }
    //     ],

    //     CareplanHealthSystemStats : [
    //         {
    //             CareplanCode            : 'Cholesterol',
    //             HealthSystem            : 'HealthSystem 01',
    //             CareplanEnrollmentCount : 10,
    //             PatientCountForHospital : [
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 }
    //             ]
    //         },
    //         {
    //             CareplanCode            : 'Cholesterol 1',
    //             HealthSystem            : 'HealthSystem 1',
    //             CareplanEnrollmentCount : 10,
    //             PatientCountForHospital : [
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 }
    //             ]
    //         }, {
    //             CareplanCode            : 'Cholesterol 2',
    //             HealthSystem            : 'HealthSystem 2',
    //             CareplanEnrollmentCount : 10,
    //             PatientCountForHospital : [
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 }
    //             ]
    //         },
    //         {
    //             CareplanCode            : 'Cholesterol 3',
    //             HealthSystem            : 'HealthSystem 3',
    //             CareplanEnrollmentCount : 10,
    //             PatientCountForHospital : [
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 }
    //             ]
    //         },
    //         {
    //             CareplanCode            : 'Cholesterol 4',
    //             HealthSystem            : 'HealthSystem 4',
    //             CareplanEnrollmentCount : 10,
    //             PatientCountForHospital : [
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },{
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },{
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 }
    //             ]
    //         }, {
    //             CareplanCode            : 'Cholesterol 5',
    //             HealthSystem            : 'HealthSystem 5',
    //             CareplanEnrollmentCount : 10,
    //             PatientCountForHospital : [
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },{
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 }
    //             ]
    //         }, {
    //             CareplanCode            : 'Cholesterol 6',
    //             HealthSystem            : 'HealthSystem 6',
    //             CareplanEnrollmentCount : 10,
    //             PatientCountForHospital : [
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },{
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 }
    //             ]
    //         }, {
    //             CareplanCode            : 'Cholesterol 7',
    //             HealthSystem            : 'HealthSystem 7',
    //             CareplanEnrollmentCount : 10,
    //             PatientCountForHospital : [
    //                 {
    //                     HospitalName : 'Hosptal 01',
    //                     PatientCount : 10
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 02',
    //                     PatientCount : 20
    //                 },
    //                 {
    //                     HospitalName : 'Hosptal 03',
    //                     PatientCount : 30
    //                 },{
    //                     HospitalName : 'Hosptal 04',
    //                     PatientCount : 40
    //                 }
    //             ]
    //         }
    //     ]
    // } ;
