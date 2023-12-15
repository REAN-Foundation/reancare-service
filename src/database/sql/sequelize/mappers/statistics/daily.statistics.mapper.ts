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
            ReportDate      : dailyStatistics.ReportDate,
            ReportTimestamp : dailyStatistics.ReportTimestamp,
            Statistics      : JSON.parse(dailyStatistics.Statistics)
        };
        return dto;
    };

}
