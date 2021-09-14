
import { FoodConsumptionEvents } from './food.consumption.types';

export interface FoodConsumptionDto {
    id?: string;
    EhrId?: string;
    PatientUserId?: string;
    Food: string;
    Description?: string;
    ConsumedAs?: FoodConsumptionEvents;
    Calories?: number;
    ImageResourceId?: string;
    StartTime?: Date;
    EndTime?: Date;
}

export interface FoodConsumptionEventDto {
    id?: string;
    PatientUserId?: string;
    Event: FoodConsumptionEvents;
    Foods: FoodConsumptionDto[];
    TotalCalories: number;
    StartTime?: Date;
    EndTime?: Date;
    DurationInMin: number;
}

export interface FoodConsumptionForDayDto {
    id?: string;
    PatientUserId?: string;
    Date: Date;
    Event: FoodConsumptionEventDto[];
    TotalCalories: number;
    StartTime?: Date;
    EndTime?: Date;
    DurationInMin: number;
}
