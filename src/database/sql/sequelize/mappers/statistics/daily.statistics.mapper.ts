import DailySystemStatistics from '../../models/statistics/daily.system.statistics.model';
import DailyTenantStatistics from '../../models/statistics/daily.tenant.statistics.model';
import { 
    DailySystemStatisticsDto, 
    DailyTenantStatisticsDto 
} from '../../../../../domain.types/statistics/daily.statistics/daily.statistics.dto';

///////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsMapper {

    static toSystemStatsDto = (stats: DailySystemStatistics): DailySystemStatisticsDto => {
        if (stats == null) {
            return null;
        }
        const dto: DailySystemStatisticsDto = {
            id              : stats.id,
            ResourceId      : stats.ResourceId,
            ReportDate      : stats.ReportDate,
            ReportTimestamp : stats.ReportTimestamp,
            DashboardStats  : JSON.parse(stats.DashboardStats),
            UserStats       : JSON.parse(stats.UserStats),
            AHAStats        : JSON.parse(stats.AHAStats),
        };
        return dto;
    };

    static toTenantStatsDto = (stats: DailyTenantStatistics): DailyTenantStatisticsDto => {
        if (stats == null) {
            return null;
        }
        const dto: DailyTenantStatisticsDto = {
            id              : stats.id,
            TenantId        : stats.TenantId,
            ReportDate      : stats.ReportDate,
            ReportTimestamp : stats.ReportTimestamp,
            DashboardStats  : JSON.parse(stats.DashboardStats),
            UserStats       : JSON.parse(stats.UserStats),
        };
        return dto;
    };

}
