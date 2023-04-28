
import { FoodConsumptionEvents } from './food.consumption.types';

export interface FoodConsumptionDto {
    id?                : string;
    EhrId?             : string;
    PatientUserId?     : string;
    TerraSummaryId?    : string;
    Provider?          : string;
    Food?              : string;
    FoodTypes?         : string[];
    Servings?          : number;
    ServingUnit?       : string;
    NutritionQuestion? : string
    UserResponse?      : boolean;
    Tags?              : string[];
    Description?       : string;
    ConsumedAs?        : FoodConsumptionEvents;
    Calories?          : number;
    ImageResourceId?   : string;
    StartTime?         : Date;
    EndTime?           : Date;
    CreatedAt?         : Date;
    UpdatedAt?         : Date;
}

export interface FoodConsumptionEventDto {
    PatientUserId? : string;
    Event          : FoodConsumptionEvents;
    Foods          : FoodConsumptionDto[];
    TotalCalories  : number;
    StartTime?     : Date;
    EndTime?       : Date;
    DurationInMin  : number;
}

export interface FoodConsumptionForDayDto {
    PatientUserId? : string;
    Date           : Date;
    Events         : FoodConsumptionEventDto[];
    TotalCalories  : number;
    StartTime?     : Date;
    EndTime?       : Date;
    DurationInMin  : number;
}
