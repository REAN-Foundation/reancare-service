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

    create = async (createModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto> => {
        try {
            const entity = {
                PatientUserId   : createModel.PatientUserId,
                Food            : createModel.Food,
                Description     : createModel.Description,
                ConsumedAs      : createModel.ConsumedAs,
                Calories        : createModel.Calories,
                ImageResourceId : createModel.ImageResourceId,
                StartTime       : createModel.StartTime,
                EndTime         : createModel.EndTime,
            };

            const foodConsumption = await FoodConsumptionModel.create(entity);
            return await FoodConsumptionMapper.toDto(foodConsumption);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<FoodConsumptionDto> => {
        try {
            const foodConsumption = await FoodConsumptionModel.findByPk(id);
            return await FoodConsumptionMapper.toDto(foodConsumption);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByEvent = async (consumedAs: string, patientUserId: string): Promise<FoodConsumptionEventDto> => {
        try {
            const foodResults = await FoodConsumptionModel.findAll({
                where : { ConsumedAs: consumedAs, PatientUserId: patientUserId }
            });

            const foodConsumptions: FoodConsumptionDto[] = [];
            for (const foodConsumption of foodResults) {
                const dto = await FoodConsumptionMapper.toDto(foodConsumption);
                foodConsumptions.push(dto);
            }

            const entity = {
                PatientUserId : patientUserId,
                Event         : FoodConsumptionEvents[consumedAs],
                Foods         : foodConsumptions,
                TotalCalories : await FoodConsumptionRepo.calculateEventTotalCalories(foodConsumptions),
                StartTime     : await FoodConsumptionRepo.calculateEventStartTime(foodConsumptions),
                EndTime       : await FoodConsumptionRepo.calculateEventEndTime(foodConsumptions),
                DurationInMin : await FoodConsumptionRepo.calculateEventDuration(foodConsumptions),
            };

            return await FoodConsumptionMapper.toEventDto(entity);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getForDay = async (date: Date, patientUserId: string): Promise<FoodConsumptionForDayDto> => {
        try {
            const startTime = new Date(date);
            startTime.setHours(0, 0, 0, 0);
            const endTime = new Date(date);
            endTime.setHours(23, 59, 59, 0);

            const foodResults = await FoodConsumptionModel.findAll({
                where : {
                    StartTime     : { [Op.gte]: startTime },
                    EndTime       : { [Op.lte]: endTime },
                    PatientUserId : patientUserId,
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
                    PatientUserId : patientUserId,
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
                PatientUserId : patientUserId,
                Events        : foodConsumptionsEvents,
                Date          : date,
                TotalCalories : await FoodConsumptionRepo.calculateTotalCaloriesForDay(foodConsumptionsEvents),
                StartTime     : await FoodConsumptionRepo.calculateStartTimeForDay(foodConsumptionsEvents),
                EndTime       : await FoodConsumptionRepo.calculateEndTimeForDay(foodConsumptionsEvents),
                DurationInMin : await FoodConsumptionRepo.calculateDurationForDay(foodConsumptionsEvents),
            };

            return await FoodConsumptionMapper.toConsumptionForDayDto(entity);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: FoodConsumptionSearchFilters): Promise<FoodConsumptionSearchResults> => {
        try {

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
            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom === null && filters.DateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom !== null && filters.DateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.DateFrom,
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

    update = async (id: string, updateModel: FoodConsumptionDomainModel):
        Promise<FoodConsumptionDto> => {
        try {
            const foodConsumption = await FoodConsumptionModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                foodConsumption.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Food != null) {
                foodConsumption.Food = updateModel.Food;
            }
            if (updateModel.Description != null) {
                foodConsumption.Description = updateModel.Description;
            }
            if (updateModel.ConsumedAs != null) {
                foodConsumption.ConsumedAs = updateModel.ConsumedAs;
            }
            if (updateModel.Calories != null) {
                foodConsumption.Calories = updateModel.Calories;
            }
            if (updateModel.ImageResourceId != null) {
                foodConsumption.ImageResourceId = updateModel.ImageResourceId;
            }
            if (updateModel.StartTime != null) {
                foodConsumption.StartTime = updateModel.StartTime;
            }
            if (updateModel.EndTime != null) {
                foodConsumption.EndTime = updateModel.EndTime;
            }
    
            await foodConsumption.save();

            return await FoodConsumptionMapper.toDto(foodConsumption);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
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
    };

    private static calculateEventStartTime = async (foods: FoodConsumptionDomainModel[]): Promise<Date> => {
        let startTime = foods[0] ? foods[0].StartTime : null;
        foods.forEach((food) => {
            if (food.StartTime < startTime) {
                startTime = food.StartTime;
            }
        });

        return startTime;
    };

    private static calculateEventEndTime = async (foods: FoodConsumptionDomainModel[]): Promise<Date> => {
        let endTime = foods[0] ? foods[0].EndTime : null;
        foods.forEach((food) => {
            if (food.EndTime > endTime) {
                endTime = food.EndTime;
            }
        });

        return endTime;
    };

    private static calculateEventDuration = async (foods: FoodConsumptionDomainModel[]): Promise<number> => {

        const startTime = await FoodConsumptionRepo.calculateEventStartTime(foods);
        const endTime = await FoodConsumptionRepo.calculateEventEndTime(foods);
        let duration = 0;

        if (startTime && endTime) {
            duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        }

        return duration;
    };

    private static calculateTotalCaloriesForDay = async (events: FoodConsumptionEventDto[]): Promise<number> => {
        let totalCalories = 0;
        events.forEach((event) => {
            totalCalories += event.TotalCalories;
        });

        return totalCalories;
    };

    private static calculateStartTimeForDay = async (events: FoodConsumptionEventDto[]): Promise<Date> => {
        let startTime = events[0] ? events[0].StartTime : null;
        events.forEach((event) => {
            if (event.StartTime < startTime) {
                startTime = event.StartTime;
            }
        });

        return startTime;
    };

    private static calculateEndTimeForDay = async (events: FoodConsumptionEventDto[]): Promise<Date> => {
        let endTime = events[0] ? events[0].EndTime : null;
        events.forEach((event) => {
            if (event.EndTime > endTime) {
                endTime = event.EndTime;
            }
        });

        return endTime;
    };

    private static calculateDurationForDay = async (events: FoodConsumptionEventDto[]): Promise<number> => {
        const startTime = await FoodConsumptionRepo.calculateStartTimeForDay(events);
        const endTime = await FoodConsumptionRepo.calculateEndTimeForDay(events);
        let duration = 0;

        if (startTime && endTime) {
            duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        }

        return duration;
    };

}
