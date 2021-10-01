import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { CalorieBalanceDomainModel } from '../../../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.domain.model';
import { CalorieBalanceDto } from '../../../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.dto';
import { CalorieBalanceSearchFilters, CalorieBalanceSearchResults } from '../../../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.search.types';
import { ICalorieBalanceRepo } from '../../../../../repository.interfaces/wellness/daily.records/calorie.balance.repo.interface';
import { CalorieBalanceMapper } from '../../../mappers/wellness/daily.records/calorie.balance.mapper';
import CalorieBalance from '../../../models/wellness/daily.records/calorie.balance.model';

///////////////////////////////////////////////////////////////////////

export class CalorieBalanceRepo implements ICalorieBalanceRepo {

    create = async (calorieBalanceDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto> => {
        try {
            const entity = {
                PersonId         : calorieBalanceDomainModel.PersonId,
                PatientUserId    : calorieBalanceDomainModel.PatientUserId ?? null,
                CaloriesConsumed : calorieBalanceDomainModel.CaloriesConsumed ?? null,
                CaloriesBurned   : calorieBalanceDomainModel.CaloriesBurned ?? null,
                Unit             : calorieBalanceDomainModel.Unit ?? null,
            };
            const calorieBalance = await CalorieBalance.create(entity);
            const dto = await CalorieBalanceMapper.toDto(calorieBalance);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<CalorieBalanceDto> => {
        try {
            const calorieBalance = await CalorieBalance.findByPk(id);
            const dto = await CalorieBalanceMapper.toDto(calorieBalance);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: CalorieBalanceSearchFilters): Promise<CalorieBalanceSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PersonId != null) {
                search.where['PersonId'] = { [Op.eq]: filters.PersonId };
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.eq]: filters.PatientUserId };
            }
            if (filters.MinCaloriesConsumedValue != null && filters.MaxCaloriesConsumedValue != null) {
                search.where['CaloriesConsumed'] = {
                    [Op.gte] : filters.MinCaloriesConsumedValue,
                    [Op.lte] : filters.MaxCaloriesConsumedValue,
                };
            }
            if (filters.MinCaloriesBurnedValue != null && filters.MaxCaloriesBurnedValue != null) {
                search.where['CaloriesBurned'] = {
                    [Op.gte] : filters.MinCaloriesBurnedValue,
                    [Op.lte] : filters.MaxCaloriesBurnedValue,
                };
            }
            if (filters.MinCalorieBalanceValue != null && filters.MaxCalorieBalanceValue != null) {
                search.where['CaloriesBalance'] = {
                    [Op.gte] : filters.MinCalorieBalanceValue,
                    [Op.lte] : filters.MaxCalorieBalanceValue,
                };
            }
            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }

            let orderByColum = 'CaloriesBurned';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await CalorieBalance.findAndCountAll(search);

            const dtos: CalorieBalanceDto[] = [];
            for (const calorieBalance of foundResults.rows) {
                const dto = await CalorieBalanceMapper.toDto(calorieBalance);
                dtos.push(dto);
            }

            const searchResults: CalorieBalanceSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, calorieBalanceDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto> => {
        try {
            const calorieBalance = await CalorieBalance.findByPk(id);

            if (calorieBalanceDomainModel.PersonId != null) {
                calorieBalance.PersonId = calorieBalanceDomainModel.PersonId;
            }
            if (calorieBalanceDomainModel.PatientUserId != null) {
                calorieBalance.PatientUserId = calorieBalanceDomainModel.PatientUserId;
            }
            if (calorieBalanceDomainModel.CaloriesConsumed != null) {
                calorieBalance.CaloriesConsumed = calorieBalanceDomainModel.CaloriesConsumed;
            }
            if (calorieBalanceDomainModel.CaloriesBurned != null) {
                calorieBalance.CaloriesBurned = calorieBalanceDomainModel.CaloriesBurned;
            }
            if (calorieBalanceDomainModel.Unit != null) {
                calorieBalance.Unit = calorieBalanceDomainModel.Unit;
            }

            await calorieBalance.save();

            const dto = await CalorieBalanceMapper.toDto(calorieBalance);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await CalorieBalance.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
