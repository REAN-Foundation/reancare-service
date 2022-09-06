import { decimal, uuid } from "../../../../domain.types/miscellaneous/system.types";
import { FoodConsumptionEvents } from "./food.consumption.types";

export interface FoodConsumptionDomainModel {
    id?                : uuid,
    EhrId?             : string;
    PatientUserId?     : uuid;
    Food?              : string;
    FoodTypes?         : string[];
    Servings?          : number;
    ServingUnit?       : string;
    NutritionQuestion? : string
    UserResponse?      : boolean;
    Tags?              : string[];
    Description?       : string;
    ConsumedAs?        : FoodConsumptionEvents;
    Calories?          : decimal;
    ImageResourceId?   : uuid;
    StartTime?         : Date;
    EndTime?           : Date;
}
