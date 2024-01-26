import { DailySystemStatisticsDto, DailyTenantStatisticsDto } from "../../../domain.types/statistics/daily.statistics/daily.statistics.dto";
import { DailySystemStatisticsDomainModel, DailyTenantStatisticsDomainModel } from "../../../domain.types/statistics/daily.statistics/daily.statistics.domain.model";

export interface IDailyStatisticsRepo {

    addDailySystemStats(model: DailySystemStatisticsDomainModel): Promise<DailySystemStatisticsDto>;

    addDailyTenantStats(model: DailyTenantStatisticsDomainModel): Promise<DailyTenantStatisticsDto>;

    getDailySystemStats(): Promise<DailySystemStatisticsDto>;

    getDailyTenantStats(tenantId: string): Promise<DailyTenantStatisticsDto>;

}
