import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { FoodComponentDomainModel } from "../../../../../../domain.types/wellness/food.component.monitoring/food.component.domain.model";
import { FoodComponentDto } from "../../../../../../domain.types/wellness/food.component.monitoring/food.component.dto";
import { FoodComponentSearchFilters, FoodComponentSearchResults } from "../../../../../../domain.types/wellness/food.component.monitoring/food.component.search.types";
import { IFoodComponentRepo } from '../../../../../repository.interfaces/wellness/food.component.monitoring/food.component.repo.interface';
import { FoodComponentMapper } from '../../../mappers/wellness/food.component.monitoring/food.component.mapper';
import FoodComponentModel from '../../../models/wellness/food.component.monitoring/food.component.model';

///////////////////////////////////////////////////////////////////////

export class FoodComponentRepo implements IFoodComponentRepo {

    create = async (foodComponentDomainModel: FoodComponentDomainModel):
    Promise<FoodComponentDto> => {
        try {
            const entity = {
                PatientUserId: foodComponentDomainModel.PatientUserId,
                TypeOfFood   : foodComponentDomainModel.TypeOfFood,
                Amount       : foodComponentDomainModel.Amount,
                Unit         : foodComponentDomainModel.Unit,
            };

            const foodComponent = await FoodComponentModel.create(entity);
            return await FoodComponentMapper.toDto(foodComponent);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<FoodComponentDto> => {
        try {
            const foodComponent = await FoodComponentModel.findByPk(id);
            return await FoodComponentMapper.toDto(foodComponent);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: FoodComponentSearchFilters): Promise<FoodComponentSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.TypeOfFood != null) {
                search.where['TypeOfFood'] = filters.TypeOfFood;
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

            const foundResults = await FoodComponentModel.findAndCountAll(search);

            const dtos: FoodComponentDto[] = [];
            for (const foodComponent of foundResults.rows) {
                const dto = await FoodComponentMapper.toDto(foodComponent);
                dtos.push(dto);
            }

            const searchResults: FoodComponentSearchResults = {
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

    update = async (id: string, updateModel: FoodComponentDomainModel):
    Promise<FoodComponentDto> => {
        try {
            const foodComponent = await FoodComponentModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                foodComponent.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.TypeOfFood != null) {
                foodComponent.TypeOfFood = updateModel.TypeOfFood;
            }
            if (updateModel.Amount != null) {
                foodComponent.Amount = updateModel.Amount;
            }
            if (updateModel.Unit != null) {
                foodComponent.Unit = updateModel.Unit;
            }

            await foodComponent.save();

            const dto = await FoodComponentMapper.toDto(foodComponent);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await FoodComponentModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
