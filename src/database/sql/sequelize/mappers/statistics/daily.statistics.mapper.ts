import DailyStatistics from '../../models/statistics/daily.statistics.model';
import { DailyStatisticsDto } from '../../../../../domain.types/statistics/daily.statistics/daily.statistics.dto';

///////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsMapper {

    static toDto = (dailyStatistics: DailyStatistics): DailyStatisticsDto => {
        if (dailyStatistics == null){
            return null;
        }
        const dto: DailyStatisticsDto = {
            id                     : dailyStatistics.id,
            StatisticsReportedDate : dailyStatistics.StatisticsReportedDate,
            CronSchedulerTime      : dailyStatistics.CronSchedulerTime,
            StatisticsData         : JSON.parse(dailyStatistics.StatisticsData)
        };
        return dto;
    };

}
