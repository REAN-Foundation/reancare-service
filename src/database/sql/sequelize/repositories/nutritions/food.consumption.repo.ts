import { IFoodConsumptionRepo } from '../../../../repository.interfaces/nutritions/food.consumption.repo.interface';
import FoodConsumptionModel from '../../models/nutritions/food.consumption.model';
import { Op } from 'sequelize';
import { FoodConsumptionMapper } from '../../mappers/nutritions/food.consumption.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { FoodConsumptionDomainModel } from "../../../../../domain.types/nutritions/food.consumption/food.consumption.domain.model";
import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from "../../../../../domain.types/nutritions/food.consumption/food.consumption.dto";
import { FoodConsumptionSearchFilters, FoodConsumptionSearchResults } from "../../../../../domain.types/nutritions/food.consumption/food.consumption.search.types";
import { FoodConsumptionEvents } from '../../../../../domain.types/nutritions/food.consumption/food.consumption.types';

///////////////////////////////////////////////////////////////////////

export class FoodConsumptionRepo implements IFoodConsumptionRepo {

    create = async (foodConsumptionDomainModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto> => {
        try {
            const entity = {
                PatientUserId   : foodConsumptionDomainModel.PatientUserId,
                Food            : foodConsumptionDomainModel.Food,
                Description     : foodConsumptionDomainModel.Description,
                ConsumedAs      : foodConsumptionDomainModel.ConsumedAs,
                Calories        : foodConsumptionDomainModel.Calories,
                ImageResourceId : foodConsumptionDomainModel.ImageResourceId,
                StartTime       : foodConsumptionDomainModel.StartTime,
                EndTime         : foodConsumptionDomainModel.EndTime,
            };

            const foodConsumption = await FoodConsumptionModel.create(entity);
            const dto = await FoodConsumptionMapper.toDto(foodConsumption);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<FoodConsumptionDto> => {
        try {
            const foodConsumption = await FoodConsumptionModel.findByPk(id);
            const dto = await FoodConsumptionMapper.toDto(foodConsumption);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByEvent = async (ConsumedAs: string, PatientUserId: string): Promise<FoodConsumptionEventDto> => {
        try {
            const foods = await FoodConsumptionModel.findAll({
                where : { ConsumedAs: ConsumedAs, PatientUserId: PatientUserId, DeletedAt: null }
            });
            const entity = {
                PatientUserId : PatientUserId,
                Event         : FoodConsumptionEvents[ConsumedAs],
                Foods         : foods,
                TotalCalories : await FoodConsumptionRepo.calculateEventTotalCalories(foods),
                StartTime     : await FoodConsumptionRepo.calculateEventStartTime(foods),
                EndTime       : await FoodConsumptionRepo.calculateEventEndTime(foods),
                DurationInMin : await FoodConsumptionRepo.calculateEventDuration(foods),
            };

            const event = await FoodConsumptionMapper.event(entity);
            return event;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByDate = async (date: Date, PatientUserId: string): Promise<FoodConsumptionForDayDto> => {
        try {
            const startTime = new Date(date);
            const endTime = new Date(date);

            const foods = await FoodConsumptionModel.findAll({
                where : {
                    StartTime     : { [Op.gte]: startTime },
                    EndTime       : { [Op.lte]: endTime },
                    PatientUserId : PatientUserId,
                    DeletedAt     : null }
            });

            const entity = {
                PatientUserId : PatientUserId,
                Event         : FoodConsumptionEventDto[Event],
                Date          : Date,
                TotalCalories : await FoodConsumptionRepo.calculateEventTotalCalories(foods),
                StartTime     : await FoodConsumptionRepo.calculateEventStartTime(foods),
                EndTime       : await FoodConsumptionRepo.calculateEventEndTime(foods),
                DurationInMin : await FoodConsumptionRepo.calculateEventDuration(foods),
            };

            const eventsForDay = await FoodConsumptionMapper.eventForDay(entity);
            return eventsForDay;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: FoodConsumptionSearchFilters): Promise<FoodConsumptionSearchResults> => {
        try {

            Logger.instance().log(`Filters 2 , ${JSON.stringify(filters)}`);
            
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.Food != null) {
                search.where['Food'] = filters.Food;
            }
            if (filters.ConsumedAs != null) {
                search.where['ConsumedAs'] = filters.ConsumedAs;
            }
            if (filters.ContactPhone != null) {
                search.where['ContactPhone'] = filters.ContactPhone;
            }
            if (filters.ContactEmail != null) {
                search.where['ContactEmail'] = filters.ContactEmail;
            }
            if (filters.TimeFrom != null && filters.TimeTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.TimeFrom,
                    [Op.lte] : filters.TimeTo,
                };
            } else if (filters.TimeFrom === null && filters.TimeTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.TimeTo,
                };
            } else if (filters.TimeFrom !== null && filters.TimeTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.TimeFrom,
                };
            }
            if (filters.ForDay !== null) {
                search.where['ForDay'] = filters.ForDay;
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

            const foundResults = await FoodConsumptionModel.findAndCountAll(search);

            const dtos: FoodConsumptionDto[] = [];
            for (const foodConsumption of foundResults.rows) {
                const dto = await FoodConsumptionMapper.toDto(foodConsumption);
                dtos.push(dto);
            }

            const searchResults: FoodConsumptionSearchResults = {
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

    update = async (id: string, foodConsumptionDomainModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto> => {
        try {
            const foodConsumption = await FoodConsumptionModel.findByPk(id);

            if (foodConsumptionDomainModel.PatientUserId != null) {
                foodConsumption.PatientUserId = foodConsumptionDomainModel.PatientUserId;
            }
            if (foodConsumptionDomainModel.Food != null) {
                foodConsumption.Food = foodConsumptionDomainModel.Food;
            }
            if (foodConsumptionDomainModel.Description != null) {
                foodConsumption.Description = foodConsumptionDomainModel.Description;
            }
            if (foodConsumptionDomainModel.ConsumedAs != null) {
                foodConsumption.ConsumedAs = foodConsumptionDomainModel.ConsumedAs;
            }
            if (foodConsumptionDomainModel.Calories != null) {
                foodConsumption.Calories = foodConsumptionDomainModel.Calories;
            }
            if (foodConsumptionDomainModel.ImageResourceId != null) {
                foodConsumption.ImageResourceId = foodConsumptionDomainModel.ImageResourceId;
            }
            if (foodConsumptionDomainModel.StartTime != null) {
                foodConsumption.StartTime = foodConsumptionDomainModel.StartTime;
            }
            if (foodConsumptionDomainModel.EndTime != null) {
                foodConsumption.EndTime = foodConsumptionDomainModel.EndTime;
            }
    
            await foodConsumption.save();

            const dto = await FoodConsumptionMapper.toDto(foodConsumption);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await FoodConsumptionModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private static calculateEventTotalCalories = async (foods: FoodConsumptionDomainModel[]): Promise<number> => {
        let totalCalories = 0;
        foods.forEach((food) => {
            totalCalories += food.Calories;
        });

        return totalCalories;
    }

    private static calculateEventStartTime = async (foods: FoodConsumptionDomainModel[]): Promise<Date> => {
        let startTime = foods[0] ? foods[0].StartTime : null;
        foods.forEach((food) => {
            if (food.StartTime < startTime) {
                startTime = food.StartTime;
            }
        });

        return startTime;
    }

    private static calculateEventEndTime = async (foods: FoodConsumptionDomainModel[]): Promise<Date> => {
        let endTime = foods[0] ? foods[0].EndTime : null;
        foods.forEach((food) => {
            if (food.EndTime > endTime) {
                endTime = food.EndTime;
            }
        });

        return endTime;
    }

    private static calculateEventDuration = async (foods: FoodConsumptionDomainModel[]): Promise<number> => {
        const startTime = await FoodConsumptionRepo.calculateEventStartTime(foods);
        const endTime = await FoodConsumptionRepo.calculateEventEndTime(foods);
        let duration = 0;

        if (startTime && endTime) {
            duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        }

        return duration;
    }

}
