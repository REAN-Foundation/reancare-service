import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from '../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto';
import { FoodConsumptionEvents } from '../../../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.types';
import FoodConsumptionModel from '../../../models/wellness/nutrition/food.consumption.model';

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
            Food            : foodConsumption.Food,
            Description     : foodConsumption.Description,
            ConsumedAs      : FoodConsumptionEvents[foodConsumption.ConsumedAs],
            Calories        : foodConsumption.Calories,
            ImageResourceId : foodConsumption.ImageResourceId,
            StartTime       : foodConsumption.StartTime,
            EndTime         : foodConsumption.EndTime,

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
