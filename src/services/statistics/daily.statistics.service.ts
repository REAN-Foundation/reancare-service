import { inject, injectable } from "tsyringe";
import { IDailyStatisticsRepo } from "../../database/repository.interfaces/statistics/daily.statistics.repo.interface";
import { DailyStatisticsDto } from "../../domain.types/statistics/daily.statistics/daily.statistics.dto";
import { DailyStatisticsDomainModel } from "../../domain.types/statistics/daily.statistics/daily.statistics.domain.model";
import { Loader } from "../../startup/loader";
import { StatisticsService } from "./statistics.service";
import { AhaStatisticsService } from "./aha.stats/aha.statistics.service";
import { TimeHelper } from "../../common/time.helper";
import { DateStringFormat } from "../../domain.types/miscellaneous/time.types";
import { Logger } from "../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DailyStatisticsService {

    constructor(
        @inject('IDailyStatisticsRepo') private _dailyStatisticsRepo: IDailyStatisticsRepo,
    ) {}

    create = async (dailyStatisticsDomainModel: DailyStatisticsDomainModel): Promise<DailyStatisticsDto> => {
        return await this._dailyStatisticsRepo.create(dailyStatisticsDomainModel);
    };

    getLatestStatistics = async (): Promise<DailyStatisticsDto> => {
        return await this._dailyStatisticsRepo.getLatestStatistics();
    };

    generateDailyStatistics = async (): Promise<void> => {
        try {
            let pdfModel = null;
            let fileResourceDto = null;

            var statisticsService = Loader.container.resolve(StatisticsService);
            const dashboardStats = await statisticsService.createDashboardStats();
            var ahaStatisticsService = Loader.container.resolve(AhaStatisticsService);
            const ahaStats = await ahaStatisticsService.getAhaStatistics();

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

            if (ahaStats) {
                pdfModel = await ahaStatisticsService.generateAhaStatsReport(ahaStats);
            }

            if (pdfModel) {
                await ahaStatisticsService.sendStatisticsByEmail(pdfModel.absFilepath, pdfModel.filename);
                fileResourceDto = await ahaStatisticsService.uploadFile(pdfModel.absFilepath);
            }

            const resourceId = fileResourceDto ? fileResourceDto.id : null;
            const userStats = await ahaStatisticsService.getUserStatistics();

            const model: DailyStatisticsDomainModel = {
                ReportDate      : TimeHelper.getDateString(new Date(),DateStringFormat.YYYY_MM_DD),
                ReportTimestamp : new Date(),
                DashboardStats  : dashboardStats ? JSON.stringify(dashboardStats) : null,
                AhaStats        : ahaStats ? JSON.stringify(ahaStats) : null,
                UserStats       : userStats ? JSON.stringify(userStats) : null,
                ResourceId      : resourceId
            };
            
            if (!model.DashboardStats && !model.AhaStats && !model.UserStats) {
                throw new Error('Dashboard stats, Aha stats & user stats is not generated.');
            }
            
            const dailyStatistics = await this.create(model);
            
            if (dailyStatistics) {
                Logger.instance().log(`${dailyStatistics.DashboardStats ? 'Dashboard stats' : ''} ${dailyStatistics.AhaStats ? 'AHA stats' : ''} ${dailyStatistics.UserStats ? 'User stats' : ''} created successfully`);
            }
        } catch (error) {
            Logger.instance().log(`Error in creating daily users statistics:${error.message}`);
        }
    };

}
