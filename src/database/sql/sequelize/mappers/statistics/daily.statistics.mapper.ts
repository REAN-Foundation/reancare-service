import DailyStatistics from '../../models/statistics/daily.statistics.model';
import { DailyStatisticsDto } from '../../../../../domain.types/statistics/daily.statistics/daily.statistics.dto';

///////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsMapper {

    static toDto = (dailyStatistics: DailyStatistics): DailyStatisticsDto => {
        if (dailyStatistics == null) {
            return null;
        }
        const dto: DailyStatisticsDto = {
            id              : dailyStatistics.id,
            ResourceId      : dailyStatistics.ResourceId,
            ReportDate      : dailyStatistics.ReportDate,
            ReportTimestamp : dailyStatistics.ReportTimestamp,
            DashboardStats  : JSON.parse(dailyStatistics.DashboardStats),
            UserStats       : JSON.parse(dailyStatistics.UserStats),
            AhaStats        : JSON.parse(dailyStatistics.AhaStats),
        };
        return dto;
    };

}
