import { NutritionQuestionnaireDto }
    from '../../../../../../domain.types/wellness/nutrition/nutrition.questionnaire/nutrition.questionnaire.dto';
import { FoodConsumptionDto,
    FoodConsumptionEventDto,
    FoodConsumptionForDayDto
} from '../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto';
import { FoodConsumptionEvents }
    from '../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.types';
import FoodConsumptionModel from '../../../models/wellness/nutrition/food.consumption.model';
import NutritionQuestionnaire from '../../../models/wellness/nutrition/nutrition.questionnaire.model';

///////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionMapper {

    static toDto = (
        foodConsumption: FoodConsumptionModel): FoodConsumptionDto => {
        if (foodConsumption == null) {
            return null;
        }
        const dto: FoodConsumptionDto = {
            id              : foodConsumption.id,
            EhrId           : foodConsumption.EhrId,
            PatientUserId   : foodConsumption.PatientUserId,
            TerraSummaryId  : foodConsumption.TerraSummaryId,
            Provider        : foodConsumption.Provider,
            Food            : foodConsumption.Food,
            FoodTypes       : foodConsumption.FoodTypes ? JSON.parse(foodConsumption.FoodTypes) : [],
            Servings        : foodConsumption.Servings,
            ServingUnit     : foodConsumption.ServingUnit,
            UserResponse    : foodConsumption.UserResponse,
            Tags            : foodConsumption.Tags ? JSON.parse(foodConsumption.Tags) : [],
            Description     : foodConsumption.Description,
            ConsumedAs      : FoodConsumptionEvents[foodConsumption.ConsumedAs] ?? null,
            Calories        : foodConsumption.Calories,
            ImageResourceId : foodConsumption.ImageResourceId,
            StartTime       : foodConsumption.StartTime,
            EndTime         : foodConsumption.EndTime,
            CreatedAt       : foodConsumption.CreatedAt,
            UpdatedAt       : foodConsumption.UpdatedAt,
        };
        return dto;
    };

    static toDetailsDto = (
        model: NutritionQuestionnaire): NutritionQuestionnaireDto => {
        if (model == null) {
            return null;
        }
        const dto: NutritionQuestionnaireDto = {
            id                  : model.id,
            Question            : model.Question,
            QuestionType        : model.QuestionType,
            AssociatedFoodTypes : model.AssociatedFoodTypes ? JSON.parse(model.AssociatedFoodTypes) : [],
            ServingUnit         : model.ServingUnit,
            Tags                : model.Tags ? JSON.parse(model.Tags) : [],
            ImageResourceId     : model.ImageResourceId,
            QuestionInfo        : model.QuestionInfo,

        };
        return dto;
    };

    static toEventDto = (
        foodConsumptionEvent: FoodConsumptionEventDto): FoodConsumptionEventDto => {
        if (foodConsumptionEvent == null) {
            return null;
        }
        const event: FoodConsumptionEventDto = {
            PatientUserId : foodConsumptionEvent.PatientUserId,
            Event         : foodConsumptionEvent.Event,
            Foods         : foodConsumptionEvent.Foods,
            TotalCalories : foodConsumptionEvent.TotalCalories,
            StartTime     : foodConsumptionEvent.StartTime,
            EndTime       : foodConsumptionEvent.EndTime,
            DurationInMin : foodConsumptionEvent.DurationInMin,

        };
        return event;
    };

    static toConsumptionForDayDto = (
        foodConsumptionEvent: FoodConsumptionForDayDto): FoodConsumptionForDayDto => {
        if (foodConsumptionEvent == null) {
            return null;
        }
        const eventsForDay: FoodConsumptionForDayDto = {
            PatientUserId : foodConsumptionEvent.PatientUserId,
            Events        : foodConsumptionEvent.Events,
            Date          : foodConsumptionEvent.Date,
            TotalCalories : foodConsumptionEvent.TotalCalories,
            StartTime     : foodConsumptionEvent.StartTime,
            EndTime       : foodConsumptionEvent.EndTime,
            DurationInMin : foodConsumptionEvent.DurationInMin,

        };
        return eventsForDay;
    };

}
