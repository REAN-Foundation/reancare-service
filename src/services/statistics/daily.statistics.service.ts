import { inject, injectable } from "tsyringe";
import { IDailyStatisticsRepo } from "../../database/repository.interfaces/statistics/daily.statistics.repo.interface";
import { DailyStatisticsDto } from "../../domain.types/statistics/daily.statistics/daily.statistics.dto";
import { DailyStatisticsDomainModel } from "../../domain.types/statistics/daily.statistics/daily.statistics.domain.model";

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

}
