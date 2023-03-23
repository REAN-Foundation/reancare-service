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

    create = async (createModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto> => {
        try {
            const entity = {
                PatientUserId    : createModel.PatientUserId,
                TerraSummaryId   : createModel.TerraSummaryId ?? null,
                Provider         : createModel.Provider ?? null,
                CaloriesConsumed : createModel.CaloriesConsumed,
                CaloriesBurned   : createModel.CaloriesBurned,
                Unit             : createModel.Unit,
                RecordDate       : createModel.RecordDate,
            };
            const calorieBalance = await CalorieBalance.create(entity);
            return await CalorieBalanceMapper.toDto(calorieBalance);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<CalorieBalanceDto> => {
        try {
            const calorieBalance = await CalorieBalance.findByPk(id);
            return await CalorieBalanceMapper.toDto(calorieBalance);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: CalorieBalanceSearchFilters): Promise<CalorieBalanceSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.eq]: filters.PatientUserId };
            }
            if (filters.MinCaloriesConsumedValue != null && filters.MaxCaloriesConsumedValue != null) {
                search.where['CaloriesConsumed'] = {
                    [Op.gte] : filters.MinCaloriesConsumedValue,
                    [Op.lte] : filters.MaxCaloriesConsumedValue,
                };
            } else if (filters.MinCaloriesConsumedValue === null && filters.MaxCaloriesConsumedValue !== null) {
                search.where['CaloriesConsumed'] = {
                    [Op.lte] : filters.MaxCaloriesConsumedValue,
                };
            } else if (filters.MinCaloriesConsumedValue !== null && filters.MaxCaloriesConsumedValue === null) {
                search.where['CaloriesConsumed'] = {
                    [Op.gte] : filters.MinCaloriesConsumedValue,
                };
            }
            if (filters.MinCaloriesBurnedValue != null && filters.MaxCaloriesBurnedValue != null) {
                search.where['CaloriesBurned'] = {
                    [Op.gte] : filters.MinCaloriesBurnedValue,
                    [Op.lte] : filters.MaxCaloriesBurnedValue,
                };
            } else if (filters.MinCaloriesBurnedValue === null && filters.MaxCaloriesBurnedValue !== null) {
                search.where['CaloriesBurned'] = {
                    [Op.lte] : filters.MaxCaloriesBurnedValue,
                };
            } else if (filters.MinCaloriesBurnedValue !== null && filters.MaxCaloriesBurnedValue === null) {
                search.where['CaloriesBurned'] = {
                    [Op.gte] : filters.MinCaloriesBurnedValue,
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

            let orderByColum = 'CreatedAt';
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

    update = async (id: string, updateModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto> => {
        try {
            const calorieBalance = await CalorieBalance.findByPk(id);

            if (updateModel.PatientUserId != null) {
                calorieBalance.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.CaloriesConsumed != null) {
                calorieBalance.CaloriesConsumed = updateModel.CaloriesConsumed;
            }
            if (updateModel.CaloriesBurned != null) {
                calorieBalance.CaloriesBurned = updateModel.CaloriesBurned;
            }
            if (updateModel.Unit != null) {
                calorieBalance.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                calorieBalance.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.TerraSummaryId != null) {
                calorieBalance.TerraSummaryId = updateModel.TerraSummaryId;
            }
            if (updateModel.Provider != null) {
                calorieBalance.Provider = updateModel.Provider;
            }

            await calorieBalance.save();

            return await CalorieBalanceMapper.toDto(calorieBalance);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await CalorieBalance.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByRecordDate = async (date: Date, patientUserId : string): Promise<CalorieBalanceDto> => {
        try {
            const new_date = new Date(date);
            const calorieBalance =  await CalorieBalance.findOne({
                where : {
                    PatientUserId : patientUserId,
                    RecordDate    : new_date
                }
            });
            return await CalorieBalanceMapper.toDto(calorieBalance);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
