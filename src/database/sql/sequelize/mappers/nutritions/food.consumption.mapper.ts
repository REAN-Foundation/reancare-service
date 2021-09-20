import FoodConsumptionModel from '../../models/nutritions/food.consumption.model';
import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from '../../../../../domain.types/nutritions/food.consumption/food.consumption.dto';

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
            ConsumedAs      : foodConsumption.ConsumedAs,
            Calories        : foodConsumption.Calories,
            ImageResourceId : foodConsumption.ImageResourceId,
            StartTime       : foodConsumption.StartTime,
            EndTime         : foodConsumption.EndTime,

        };
        return dto;
    }

    static event = (
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
    }

    static eventForDay = (
        foodConsumptionEvent: FoodConsumptionForDayDto): FoodConsumptionForDayDto => {
        if (foodConsumptionEvent == null) {
            return null;
        }
        const eventsForDay: FoodConsumptionForDayDto = {
            PatientUserId : foodConsumptionEvent.PatientUserId,
            Event         : foodConsumptionEvent.Event,
            Date          : foodConsumptionEvent.Date,
            TotalCalories : foodConsumptionEvent.TotalCalories,
            StartTime     : foodConsumptionEvent.StartTime,
            EndTime       : foodConsumptionEvent.EndTime,
            DurationInMin : foodConsumptionEvent.DurationInMin,

        };
        return eventsForDay;
    }

}
