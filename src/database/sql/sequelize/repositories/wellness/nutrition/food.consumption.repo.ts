import { Op } from 'sequelize';
import { NutritionQuestionnaireDomainModel } from
    '../../../../../../domain.types/wellness/nutrition/nutrition.questionnaire/nutrition.questionnaire.domain.model';
import { NutritionQuestionnaireDto }
    from '../../../../../../domain.types/wellness/nutrition/nutrition.questionnaire/nutrition.questionnaire.dto';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { FoodConsumptionDomainModel }
    from "../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.domain.model";
import { FoodConsumptionDto,
    FoodConsumptionEventDto,
    FoodConsumptionForDayDto
} from "../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto";
import { FoodConsumptionSearchFilters,
    FoodConsumptionSearchResults
} from "../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.search.types";
import { FoodConsumptionEvents }
    from '../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.types';
import { IFoodConsumptionRepo }
    from '../../../../../repository.interfaces/wellness/nutrition/food.consumption.repo.interface';
import { FoodConsumptionMapper } from '../../../mappers/wellness/nutrition/food.consumption.mapper';
import FoodConsumption from '../../../models/wellness/nutrition/food.consumption.model';
import NutritionQuestionnaire from '../../../models/wellness/nutrition/nutrition.questionnaire.model';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { HelperRepo } from '../../common/helper.repo';

///////////////////////////////////////////////////////////////////////

export class FoodConsumptionRepo implements IFoodConsumptionRepo {

    public create = async (createModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto> => {
        try {
            const entity = {
                PatientUserId   : createModel.PatientUserId,
                TerraSummaryId  : createModel.TerraSummaryId,
                Provider        : createModel.Provider,
                Food            : createModel.Food,
                Description     : createModel.Description,
                ConsumedAs      : createModel.ConsumedAs,
                Calories        : createModel.Calories,
                ImageResourceId : createModel.ImageResourceId,
                StartTime       : createModel.StartTime,
                EndTime         : createModel.EndTime,
                FoodTypes       : createModel.FoodTypes &&
                    createModel.FoodTypes.length > 0 ? JSON.stringify(createModel.FoodTypes) : null,
                Servings     : createModel.Servings,
                ServingUnit  : createModel.ServingUnit,
                UserResponse : createModel.UserResponse ?? null,
                Tags         : createModel.Tags && createModel.Tags.length > 0 ? JSON.stringify(createModel.Tags) : null,
            };

            const foodConsumption = await FoodConsumption.create(entity);

            return await FoodConsumptionMapper.toDto(foodConsumption);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public createNutritionQuestionnaire = async (createModel: NutritionQuestionnaireDomainModel):
    Promise<NutritionQuestionnaireDto> => {
        try {
            const entity = {
                Question            : createModel.Question,
                QuestionType        : createModel.QuestionType,
                AssociatedFoodTypes : createModel.AssociatedFoodTypes && createModel.AssociatedFoodTypes.length > 0 ?
                    JSON.stringify(createModel.AssociatedFoodTypes) : null,
                Tags            : createModel.Tags && createModel.Tags.length > 0 ? JSON.stringify(createModel.Tags) : null,
                ServingUnit     : createModel.ServingUnit,
                ImageResourceId : createModel.ImageResourceId,
                QuestionInfo    : createModel.QuestionInfo,
            };

            const nutrition = await NutritionQuestionnaire.create(entity);
            return await FoodConsumptionMapper.toDetailsDto(nutrition);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getById = async (id: string): Promise<FoodConsumptionDto> => {
        try {
            const foodConsumption = await FoodConsumption.findByPk(id);
            return await FoodConsumptionMapper.toDto(foodConsumption);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getByEvent = async (consumedAs: string, patientUserId: string): Promise<FoodConsumptionEventDto> => {
        try {
            const foodResults = await FoodConsumption.findAll({
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

    public getForDay = async (date: Date, patientUserId: string): Promise<FoodConsumptionForDayDto> => {
        try {
            const startTime = new Date(date);
            startTime.setHours(0, 0, 0, 0);
            const endTime = new Date(date);
            endTime.setHours(23, 59, 59, 0);

            const foodResults = await FoodConsumption.findAll({
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

    public search = async (filters: FoodConsumptionSearchFilters): Promise<FoodConsumptionSearchResults> => {
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

            const foundResults = await FoodConsumption.findAndCountAll(search);

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

    public update = async (id: string, updateModel: FoodConsumptionDomainModel):
        Promise<FoodConsumptionDto> => {
        try {
            const foodConsumption = await FoodConsumption.findByPk(id);

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
            if (updateModel.UserResponse != null) {
                foodConsumption.UserResponse = updateModel.UserResponse;
            }

            await foodConsumption.save();

            return await FoodConsumptionMapper.toDto(foodConsumption);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            const result = await FoodConsumption.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public totalCount = async (): Promise<number> => {
        try {
            return await NutritionQuestionnaire.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getNutritionQuestionnaire = async (): Promise<NutritionQuestionnaireDto[]> => {
        try {
            const filter = { where: {} };

            const questionnaire = await NutritionQuestionnaire.findAll(filter);
            const dtos: NutritionQuestionnaireDto[] = [];
            for (const q of questionnaire) {
                const dto = FoodConsumptionMapper.toDetailsDto(q);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const numDays = 30 * numMonths;
            const questionnaireStats = await this.getQuestionnaireStats(patientUserId, numDays);
            const calorieStats = await this.getDayByDayCalorieStats(patientUserId, numDays);
            return {
                QuestionnaireStats : questionnaireStats,
                CalorieStats       : calorieStats,
            };
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    //#endregion

    //#region Privates

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

    private async getQuestionnaireStats(patientUserId: string, numDays: number) {

        const records = await this.getQuestionnaireRecords(patientUserId, numDays, DurationType.Day);
        if (records.length === 0) {
            return null;
        }
        const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);

        const records_ = records.map(x => {
            const tempDate = TimeHelper.addDuration(x.CreatedAt, offsetMinutes, DurationType.Minute);
            const dayStr = tempDate.toISOString()
                .split('T')[0];
            return {
                FoodTypes    : x.FoodTypes,
                CreatedAt    : x.CreatedAt,
                Servings     : x.Servings,
                UserResponse : x.UserResponse,
                DayStr       : dayStr,
            };
        });

        //Questionnaire handling
        const genericNutritionRecords = records_.filter(x => x.FoodTypes === `["GenericNutrition"]`);
        const proteinConsumptionRecords = records_.filter(x => x.FoodTypes === `["Protein"]`);
        const lowSaltConsumptionRecords = records_.filter(x => x.FoodTypes === `["Salt"]`);

        const vegetableServingsRecords = records_.filter(x => x.FoodTypes === `["Vegetables"]`);
        const fruitServingsRecords = records_.filter(x => x.FoodTypes === `["Fruits"]`);
        const grainServingsRecords = records_.filter(x => x.FoodTypes === `["Grains"]`);
        const sugaryDrinksServingsRecords = records_.filter(x => x.FoodTypes === `["Sugary drinks"]`);
        const seaFoodServingsRecords = records_.filter(x => x.FoodTypes === `["Sea food"]`);

        const healthyFoodChoicesStats = this.getBooleanStats(genericNutritionRecords, numDays, offsetMinutes, 'Healthy');
        const healthyProteinConsumptionStats = this.getBooleanStats(proteinConsumptionRecords, numDays, offsetMinutes, 'Protein');
        const lowSaltConsumptionStats = this.getBooleanStats(lowSaltConsumptionRecords, numDays, offsetMinutes, 'Low Salt');

        const vegetableServingsStats = this.getServingStats(vegetableServingsRecords, numDays, offsetMinutes, 'Veggies');
        const fruitServingsStatss = this.getServingStats(fruitServingsRecords, numDays, offsetMinutes, 'Fruits');
        const grainServingsStats = this.getServingStats(grainServingsRecords, numDays, offsetMinutes, 'Grains');
        const sugaryDrinksServingsStats = this.getServingStats(sugaryDrinksServingsRecords, numDays, offsetMinutes, 'Sugar');
        const seaFoodServingsStats = this.getServingStats(seaFoodServingsRecords, numDays, offsetMinutes, 'Seafood');

        return {
            HealthyFoodChoices : {
                Question : `Were most of your food choices healthy today?`,
                Stats    : healthyFoodChoicesStats,
            },
            HealthyProteinConsumptions : {
                Question : `Did you select healthy sources of protein today?`,
                Stats    : healthyProteinConsumptionStats,
            },
            LowSaltFoods : {
                Question : `Did you choose or prepare foods with little or no salt today?`,
                Stats    : lowSaltConsumptionStats,
            },
            VegetableServings : {
                Question : `How many servings of vegetables did you eat today?`,
                Stats    : vegetableServingsStats,
            },
            FruitServings : {
                Question : `How many servings of fruit did you eat today?`,
                Stats    : fruitServingsStatss,
            },
            WholeGrainServings : {
                Question : `How many servings of whole grains did you eat today?`,
                Stats    : grainServingsStats,
            },
            SugaryDrinksServings : {
                Question : `How many servings of sugary drinks did you drink today?`,
                Stats    : sugaryDrinksServingsStats,
            },
            SeafoodServings : {
                Question : `How many servings of fish or shellfish/seafood did you eat today?`,
                Stats    : seaFoodServingsStats,
            },
        };
    }

    private getBooleanStats = (records: any[], numDays: number, timezoneOffsetMinutes: number, key: string) => {
        const dayList = Array.from({ length: numDays }, (_, index) => index + 1);
        const reference = TimeHelper.getStartOfDay(new Date(), timezoneOffsetMinutes);
        const stats = [];

        for (var day of dayList) {
            var dayStart = TimeHelper.subtractDuration(reference, day * 24, DurationType.Hour);
            const dayStr = dayStart.toISOString().split('T')[0];
            const x = records.find(r => r.DayStr === dayStr);
            if (x && x?.UserResponse === true) {
                stats.push({
                    Response : 1,
                    Type     : key,
                    DayStr   : dayStr,
                });
            }
            else {
                stats.push({
                    Response : 0,
                    Type     : key,
                    DayStr   : dayStr,
                });
            }
        }
        const stats_ = stats.sort((a, b) => new Date(a.DayStr).getTime() - new Date(b.DayStr).getTime());
        return stats_;
    };

    private getServingStats = (records: any[], numDays: number, timezoneOffsetMinutes: number, key: string) => {

        const dayList = Array.from({ length: numDays }, (_, index) => index + 1);
        const reference = TimeHelper.getStartOfDay(new Date(), timezoneOffsetMinutes);
        const stats = [];

        for (var day of dayList) {
            var dayStart = TimeHelper.subtractDuration(reference, day * 24, DurationType.Hour);
            const dayStr = dayStart.toISOString().split('T')[0];
            const filteredForDay = records.filter(r => r.DayStr === dayStr);
            if (filteredForDay.length === 0) {
                stats.push({
                    Servings : 0,
                    Type     : key,
                    DayStr   : dayStr,
                });
            }
            else if (filteredForDay.length === 1) {
                stats.push({
                    Servings : filteredForDay[0].Servings,
                    Type     : key,
                    DayStr   : dayStr,
                });
            }
            else {
                const val = filteredForDay.reduce((acc, x) => acc + x.Servings, 0);
                stats.push({
                    Servings : val,
                    Type     : key,
                    DayStr   : dayStr,
                });
            }
        }
        const stats_ = stats.sort((a, b) => new Date(a.DayStr).getTime() - new Date(b.DayStr).getTime());
        return stats_;
    };

    private async getQuestionnaireRecords(patientUserId: string, count: number, unit: DurationType) {
        const today = new Date();
        const from = TimeHelper.subtractDuration(new Date(), count, unit);
        let nutritionRecords = await FoodConsumption.findAll({
            where : {
                PatientUserId : patientUserId,
                FoodTypes     : {
                    [Op.not] : null,
                },
                CreatedAt : {
                    [Op.gte] : from,
                    [Op.lte] : today,
                }
            }
        });
        nutritionRecords = nutritionRecords.sort((a, b) => a.CreatedAt.getTime() - b.CreatedAt.getTime());
        return nutritionRecords;
    }

    private async getDayByDayCalorieStats(patientUserId: string, numDays: number) {

        const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
        const dayList = Array.from({ length: numDays }, (_, index) => index + 1);
        const reference = TimeHelper.getStartOfDay(new Date(), offsetMinutes);

        const stats = [];

        //Check whether the records exist or not
        const from = TimeHelper.subtractDuration(reference, numDays, DurationType.Day);
        const records = await FoodConsumption.findAll({
            where : {
                PatientUserId : patientUserId,
                FoodTypes     : null,
                CreatedAt     : {
                    [Op.gte] : from,
                    [Op.lte] : new Date(),
                }
            }
        });
        if (records.length === 0) {
            return [];
        }

        for await (var day of dayList) {

            var dayStart = TimeHelper.subtractDuration(reference, day * 24, DurationType.Hour);
            var dayEnd = TimeHelper.subtractDuration(reference, (day - 1) * 24, DurationType.Hour);

            const dayStr = dayStart.toISOString().split('T')[0];

            const consumptions = await FoodConsumption.findAll({
                where : {
                    PatientUserId : patientUserId,
                    FoodTypes     : null,
                    CreatedAt     : {
                        [Op.gte] : dayStart,
                        [Op.lte] : dayEnd,
                    }
                }
            });
            let totalCaloriesForDay = 0;
            consumptions.forEach((food) => {
                totalCaloriesForDay += food.Calories;
            });

            stats.push({
                DayStr   : dayStr,
                Calories : totalCaloriesForDay,
            });
        }
        return stats;
    }

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await FoodConsumption.findAll({
                where : {
                    PatientUserId : patientUserId,
                    UserResponse  : {
                        [Op.not] : null,
                    },
                    CreatedAt : {
                        [Op.gte] : dateFrom,
                        [Op.lte] : dateTo,
                    }
                }
            });
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                var recordDate = x.StartTime ?? x.EndTime;
                if (!recordDate) {
                    recordDate = x.CreatedAt;
                }
                const tempDate = TimeHelper.addDuration(recordDate, offsetMinutes, DurationType.Minute);
                const recordDateStr = await TimeHelper.formatDateToLocal_YYYY_MM_DD(recordDate);
                return {
                    RecordId       : x.id,
                    PatientUserId  : x.PatientUserId,
                    UserResponse   : x.UserResponse,
                    RecordDate     : tempDate,
                    RecordDateStr  : recordDateStr,
                    RecordTimeZone : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date): Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await FoodConsumption.findAll({
                where : {
                    PatientUserId : patientUserId,
                    UserResponse  : {
                        [Op.not] : null,
                    },
                    CreatedAt : {
                        [Op.lte] : date,
                    }
                }
            });
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                var recordDate = x.StartTime ?? x.EndTime;
                if (!recordDate) {
                    recordDate = x.CreatedAt;
                }
                const tempDate = TimeHelper.addDuration(recordDate, offsetMinutes, DurationType.Minute);
                return {
                    RecordId       : x.id,
                    PatientUserId  : x.PatientUserId,
                    UserResponse   : x.UserResponse,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(recordDate),
                    RecordTimeZone : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
