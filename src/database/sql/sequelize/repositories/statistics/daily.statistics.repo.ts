import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import { IDailyStatisticsRepo } from '../../../../../database/repository.interfaces/statistics/daily.statistics.repo.interface';
import { DailySystemStatisticsDto, DailyTenantStatisticsDto } from '../../../../../domain.types/statistics/daily.statistics/daily.statistics.dto';
import DailySystemStatistics from '../../models/statistics/daily.system.statistics.model';
import DailyTenantStatistics from '../../models/statistics/daily.tenant.statistics.model';
import { DailyStatisticsMapper } from '../../mappers/statistics/daily.statistics.mapper';
import { 
    DailySystemStatisticsDomainModel, 
    DailyTenantStatisticsDomainModel 
} from '../../../../../domain.types/statistics/daily.statistics/daily.statistics.domain.model';

///////////////////////////////////////////////////////////////////////

export class DailyStatisticsRepo implements IDailyStatisticsRepo {

    addDailySystemStats = async (model: DailySystemStatisticsDomainModel)
        : Promise<DailySystemStatisticsDto> => {
        try {
            const entity = {
                ReportDate      : model.ReportDate ?? null,
                ResourceId      : model.ResourceId ?? null,
                ReportTimestamp : model.ReportTimestamp ?? null,
                DashboardStats  : model.DashboardStats ?? null,
                UserStats       : model.UserStats ?? null,
                AHAStats        : model.AHAStats ?? null
            };
            const dailyStatistics = await DailySystemStatistics.create(entity);
            const dto = DailyStatisticsMapper.toSystemStatsDto(dailyStatistics);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addDailyTenantStats = async (model: DailyTenantStatisticsDomainModel)
        : Promise<DailyTenantStatisticsDto> => {
        try {
            const entity = {
                ReportDate      : model.ReportDate ?? null,
                TenantId        : model.TenantId ?? null,
                ReportTimestamp : model.ReportTimestamp ?? null,
                DashboardStats  : model.DashboardStats ?? null,
                UserStats       : model.UserStats ?? null,
            };
            const dailyStatistics = await DailyTenantStatistics.create(entity);
            const dto = DailyStatisticsMapper.toTenantStatsDto(dailyStatistics);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getDailySystemStats = async (): Promise<DailySystemStatisticsDto> => {
        try {
            const stats = await DailySystemStatistics.findOne({
                order : [['CreatedAt', 'DESC']],
            });
            const dto = DailyStatisticsMapper.toSystemStatsDto(stats);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getDailyTenantStats = async (tenantId: uuid): Promise<DailyTenantStatisticsDto> => {
        try {
            const stats = await DailyTenantStatistics.findOne({
                where : {
                    TenantId : tenantId,
                },
                order : [['CreatedAt', 'DESC']],
            });
            const dto = DailyStatisticsMapper.toTenantStatsDto(stats);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
