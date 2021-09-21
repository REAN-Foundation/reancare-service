//import { FoodConsumptionEvents } from "./food.consumption.types";

export interface FoodConsumptionDomainModel {
    id?: string,
    EhrId?: string;
    PatientUserId?: string;
    Food: string;
    Description?: string;

    //ConsumedAs?: FoodConsumptionEvents;

    ConsumedAs?: string;
    Calories?: number;
    ImageResourceId?: string;
    StartTime?: Date;
    EndTime?: Date;
}
