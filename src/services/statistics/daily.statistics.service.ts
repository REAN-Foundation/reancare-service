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
import { ITenantRepo } from "../../database/repository.interfaces/tenant/tenant.repo.interface";
import { TenantSearchFilters } from "../../domain.types/tenant/tenant.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DailyStatisticsService {

    constructor(
        @inject('IDailyStatisticsRepo') private _dailyStatisticsRepo: IDailyStatisticsRepo,
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
    ) {}

    getDailySystemStats = async (): Promise<DailySystemStatisticsDto> => {
        return await this._dailyStatisticsRepo.getDailySystemStats();
    };

    getDailyTenantStats = async (tenantId: uuid): Promise<DailyTenantStatisticsDto> => {
        return await this._dailyStatisticsRepo.getDailyTenantStats(tenantId);
    };

    generateDailySystemStats = async (): Promise<void> => {
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
            
            const statsRecord = await this._dailyStatisticsRepo.addDailySystemStats(model);
            if (statsRecord) {
                Logger.instance().log(`Daily stats: ${JSON.stringify(statsRecord)}`);
            }

        } catch (error) {
            Logger.instance().log(`Error generating statistics : ${error.message}`);
        }
    };

    generateDailyStatsForAllTenants = async (): Promise<void> => {
        try {
            const filter: TenantSearchFilters = {
                ItemsPerPage : 1000,
                PageIndex    : 0,
            };
            const tenantSearchResults = await this._tenantRepo.search(filter);
            const tenantIds = tenantSearchResults.Items.map(t => t.id);
            for (const tenantId of tenantIds) {
                await this.generateDailyStatisForTenant(tenantId);
            }
        }
        catch (error) {
            Logger.instance().log(`Error generating statistics for all tenants : ${error.message}`);
        }
    };

    generateDailyStatisForTenant = async (tenantId: uuid): Promise<void> => {
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
            
            const statsRecord = await this._dailyStatisticsRepo.addDailyTenantStats(model);
            if (statsRecord) {
                Logger.instance().log(`Daily stats: ${JSON.stringify(statsRecord)}`);
            }

        } catch (error) {
            Logger.instance().log(`Error in creating daily users statistics:${error.message}`);
        }
    };

}
