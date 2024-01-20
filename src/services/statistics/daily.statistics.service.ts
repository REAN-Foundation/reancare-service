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
