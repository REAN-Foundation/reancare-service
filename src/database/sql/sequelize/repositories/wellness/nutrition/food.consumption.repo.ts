import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { FoodConsumptionDomainModel } from "../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.domain.model";
import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from "../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto";
import { FoodConsumptionSearchFilters, FoodConsumptionSearchResults } from "../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.search.types";
import { FoodConsumptionEvents } from '../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.types';
import { IFoodConsumptionRepo } from '../../../../../repository.interfaces/wellness/nutrition/food.consumption.repo.interface';
import { FoodConsumptionMapper } from '../../../mappers/wellness/nutrition/food.consumption.mapper';
import FoodConsumptionModel from '../../../models/wellness/nutrition/food.consumption.model';

///////////////////////////////////////////////////////////////////////

export class FoodConsumptionRepo implements IFoodConsumptionRepo {

    create = async (foodConsumptionDomainModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto> => {
        try {
            const entity = {
                PatientUserId   : foodConsumptionDomainModel.PatientUserId,
                Food            : foodConsumptionDomainModel.Food,
                Description     : foodConsumptionDomainModel.Description,
                ConsumedAs      : FoodConsumptionEvents[foodConsumptionDomainModel.ConsumedAs],
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
            const foodResults = await FoodConsumptionModel.findAll({
                where : { ConsumedAs: ConsumedAs, PatientUserId: PatientUserId, DeletedAt: null }
            });

            const foodConsumptions: FoodConsumptionDto[] = [];
            for (const foodConsumption of foodResults) {
                const dto = await FoodConsumptionMapper.toDto(foodConsumption);
                foodConsumptions.push(dto);
            }

            const entity = {
                PatientUserId : PatientUserId,
                Event         : FoodConsumptionEvents[ConsumedAs],
                Foods         : foodConsumptions,
                TotalCalories : await FoodConsumptionRepo.calculateEventTotalCalories(foodConsumptions),
                StartTime     : await FoodConsumptionRepo.calculateEventStartTime(foodConsumptions),
                EndTime       : await FoodConsumptionRepo.calculateEventEndTime(foodConsumptions),
                DurationInMin : await FoodConsumptionRepo.calculateEventDuration(foodConsumptions),
            };

            const event = await FoodConsumptionMapper.toEventDto(entity);
            return event;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getForDay = async (date: Date, PatientUserId: string): Promise<FoodConsumptionForDayDto> => {
        try {
            const startTime = new Date(date);
            startTime.setHours(0, 0, 0, 0);
            const endTime = new Date(date);
            endTime.setHours(23, 59, 59, 0);

            const foodResults = await FoodConsumptionModel.findAll({
                where : {
                    StartTime     : { [Op.gte]: startTime },
                    EndTime       : { [Op.lte]: endTime },
                    PatientUserId : PatientUserId,
                    DeletedAt     : null
                },
                order : [['StartTime', 'ASC']]
            });

            const foodConsumptions: FoodConsumptionDto[] = [];
            for (const foodConsumption of foodResults) {
                const dto = await FoodConsumptionMapper.toDto(foodConsumption);
                foodConsumptions.push(dto);
            }

            // get distinct food consumption events for the day
            const availableFoodEvents = {};
            foodConsumptions.forEach((food: FoodConsumptionDomainModel) => {
                if (Object.keys(availableFoodEvents).indexOf(food.ConsumedAs) === -1) {
                    availableFoodEvents[food.ConsumedAs] = [];
                }

                availableFoodEvents[food.ConsumedAs].push(food);
            });

            // get food consumption event for each event
            const foodConsumptionsEvents = [];
            for (const eventName of Object.keys(availableFoodEvents)) {
                const foodConsumptions = availableFoodEvents[eventName];

                const eventEntity = {
                    PatientUserId : PatientUserId,
                    Event         : FoodConsumptionEvents[eventName],
                    Foods         : foodConsumptions,
                    TotalCalories : await FoodConsumptionRepo.calculateEventTotalCalories(foodConsumptions),
                    StartTime     : await FoodConsumptionRepo.calculateEventStartTime(foodConsumptions),
                    EndTime       : await FoodConsumptionRepo.calculateEventEndTime(foodConsumptions),
                    DurationInMin : await FoodConsumptionRepo.calculateEventDuration(foodConsumptions),
                };

                foodConsumptionsEvents.push(eventEntity);
            }

            const entity = {
                PatientUserId : PatientUserId,
                Events        : foodConsumptionsEvents,
                Date          : date,
                TotalCalories : await FoodConsumptionRepo.calculateTotalCaloriesForDay(foodConsumptionsEvents),
                StartTime     : await FoodConsumptionRepo.calculateStartTimeForDay(foodConsumptionsEvents),
                EndTime       : await FoodConsumptionRepo.calculateEndTimeForDay(foodConsumptionsEvents),
                DurationInMin : await FoodConsumptionRepo.calculateDurationForDay(foodConsumptionsEvents),
            };

            const eventsForDay = await FoodConsumptionMapper.toConsumptionForDayDto(entity);
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
                const startTime = new Date(filters.ForDay);
                startTime.setHours(0, 0, 0, 0);
                const endTime = new Date(filters.ForDay);
                endTime.setHours(23, 59, 59, 0);

                search.where['StartTime'] = { [Op.gte]: startTime };
                search.where['EndTime'] = { [Op.lte]: endTime };
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

    private static calculateTotalCaloriesForDay = async (events: FoodConsumptionEventDto[]): Promise<number> => {
        let totalCalories = 0;
        events.forEach((event) => {
            totalCalories += event.TotalCalories;
        });

        return totalCalories;
    }

    private static calculateStartTimeForDay = async (events: FoodConsumptionEventDto[]): Promise<Date> => {
        let startTime = events[0] ? events[0].StartTime : null;
        events.forEach((event) => {
            if (event.StartTime < startTime) {
                startTime = event.StartTime;
            }
        });

        return startTime;
    }

    private static calculateEndTimeForDay = async (events: FoodConsumptionEventDto[]): Promise<Date> => {
        let endTime = events[0] ? events[0].EndTime : null;
        events.forEach((event) => {
            if (event.EndTime > endTime) {
                endTime = event.EndTime;
            }
        });

        return endTime;
    }

    private static calculateDurationForDay = async (events: FoodConsumptionEventDto[]): Promise<number> => {
        const startTime = await FoodConsumptionRepo.calculateStartTimeForDay(events);
        const endTime = await FoodConsumptionRepo.calculateEndTimeForDay(events);
        let duration = 0;

        if (startTime && endTime) {
            duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        }

        return duration;
    }

}
