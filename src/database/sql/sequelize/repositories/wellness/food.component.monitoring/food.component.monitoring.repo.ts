import { Op } from 'sequelize';
import {
    FoodComponentMonitoringTypes,
    FoodComponentMonitoringTypesList
} from '../../../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { FoodComponentMonitoringDomainModel } from "../../../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.domain.model";
import { FoodComponentMonitoringDto } from "../../../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.dto";
import {
    FoodComponentMonitoringSearchFilters,
    FoodComponentMonitoringSearchResults
} from "../../../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.search.types";
import { IFoodComponentMonitoringRepo } from '../../../../../repository.interfaces/wellness/food.component.monitoring/food.component.monitoring.repo.interface';
import { FoodComponentMonitoringMapper } from '../../../mappers/wellness/food.component.monitoring/food.component.monitoring.mapper';
import FoodComponentMonitoringModel from '../../../models/wellness/food.component.monitoring/food.component.monitoring.model';

///////////////////////////////////////////////////////////////////////

export class FoodComponentMonitoringRepo implements IFoodComponentMonitoringRepo {

    create = async (foodComponentMonitoringDomainModel: FoodComponentMonitoringDomainModel):
    Promise<FoodComponentMonitoringDto> => {
        try {
            const monitoredFoodComponent =
                FoodComponentMonitoringTypesList.includes(foodComponentMonitoringDomainModel.MonitoredFoodComponent) ?
                    foodComponentMonitoringDomainModel.MonitoredFoodComponent : FoodComponentMonitoringTypes.Other;

            const entity = {
                PatientUserId          : foodComponentMonitoringDomainModel.PatientUserId,
                MonitoredFoodComponent : monitoredFoodComponent,
                Amount                 : foodComponentMonitoringDomainModel.Amount,
                Unit                   : foodComponentMonitoringDomainModel.Unit,
            };

            const foodComponentMonitoring = await FoodComponentMonitoringModel.create(entity);
            return await FoodComponentMonitoringMapper.toDto(foodComponentMonitoring);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<FoodComponentMonitoringDto> => {
        try {
            const foodComponentMonitoring = await FoodComponentMonitoringModel.findByPk(id);
            return await FoodComponentMonitoringMapper.toDto(foodComponentMonitoring);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: FoodComponentMonitoringSearchFilters): Promise<FoodComponentMonitoringSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MonitoredFoodComponent != null) {
                search.where['MonitoredFoodComponent'] = filters.MonitoredFoodComponent;
            }
            if (filters.AmountFrom != null && filters.AmountTo != null) {
                search.where['Amount'] = {
                    [Op.gte] : filters.AmountFrom,
                    [Op.lte] : filters.AmountTo,
                };
            } else if (filters.AmountFrom === null && filters.AmountTo !== null) {
                search.where['Amount'] = {
                    [Op.lte] : filters.AmountTo,
                };
            } else if (filters.AmountFrom !== null && filters.AmountTo === null) {
                search.where['Amount'] = {
                    [Op.gte] : filters.AmountFrom,
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

            const foundResults = await FoodComponentMonitoringModel.findAndCountAll(search);

            const dtos: FoodComponentMonitoringDto[] = [];
            for (const foodComponentMonitoring of foundResults.rows) {
                const dto = await FoodComponentMonitoringMapper.toDto(foodComponentMonitoring);
                dtos.push(dto);
            }

            const searchResults: FoodComponentMonitoringSearchResults = {
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

    update = async (id: string, updateModel: FoodComponentMonitoringDomainModel):
    Promise<FoodComponentMonitoringDto> => {
        try {
            const foodComponentMonitoring = await FoodComponentMonitoringModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                foodComponentMonitoring.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.MonitoredFoodComponent != null) {
                foodComponentMonitoring.MonitoredFoodComponent = updateModel.MonitoredFoodComponent;
            }
            if (updateModel.Amount != null) {
                foodComponentMonitoring.Amount = updateModel.Amount;
            }
            if (updateModel.Unit != null) {
                foodComponentMonitoring.Unit = updateModel.Unit;
            }

            await foodComponentMonitoring.save();

            return await FoodComponentMonitoringMapper.toDto(foodComponentMonitoring);
           
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await FoodComponentMonitoringModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
