import { DailyStatisticsDto } from "../../../domain.types/statistics/daily.statistics/daily.statistics.dto";
import { DailyStatisticsDomainModel } from "../../../domain.types/statistics/daily.statistics/daily.statistics.domain.model";

export interface IDailyStatisticsRepo {

    create(dailyStatisticsDomainModel: DailyStatisticsDomainModel): Promise<DailyStatisticsDto>;

    getLatestStatistics(): Promise<DailyStatisticsDto>;

}
