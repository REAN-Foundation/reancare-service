import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { IDailyStatisticsRepo } from '../../../../../database/repository.interfaces/statistics/daily.statistics.repo.interface';
import { DailyStatisticsDto } from '../../../../../domain.types/statistics/daily.statistics/daily.statistics.dto';
import DailyStatistics from '../../models/statistics/daily.statistics.model';
import { DailyStatisticsMapper } from '../../mappers/statistics/daily.statistics.mapper';
import { DailyStatisticsDomainModel } from '../../../../../domain.types/statistics/daily.statistics/daily.statistics.domain.model';

///////////////////////////////////////////////////////////////////////

export class DailyStatisticsRepo implements IDailyStatisticsRepo {

    create = async (dailyStatisticsDomainModel: DailyStatisticsDomainModel): Promise<DailyStatisticsDto> => {
        try {
            const entity = {
                StatisticsReportedDate : dailyStatisticsDomainModel.StatisticsReportedDate ?? null,
                CronSchedulerTime      : dailyStatisticsDomainModel.CronSchedulerTime ?? null,
                StatisticsData         : dailyStatisticsDomainModel.StatisticsData ?? null
            };
            const dailyStatistics = await DailyStatistics.create(entity);
            const dto = await DailyStatisticsMapper.toDto(dailyStatistics);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getLatestStatistics = async (): Promise<DailyStatisticsDto> => {
        try {
            
            const latestStatistics = await DailyStatistics.findOne({
                order : [['CreatedAt', 'DESC']],
            });
            const dto = await DailyStatisticsMapper.toDto(latestStatistics);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
