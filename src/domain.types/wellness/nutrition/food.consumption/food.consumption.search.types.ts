import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from "./food.consumption.dto";
import { FoodConsumptionEvents } from "./food.consumption.types";

//////////////////////////////////////////////////////////////////////

export interface FoodConsumptionSearchFilters {
    PatientUserId?: string;
    Food?: string;
    ConsumedAs?: FoodConsumptionEvents;
    TimeFrom: Date;
    TimeTo: Date;
    ForDay: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface FoodConsumptionSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: FoodConsumptionDto[] | FoodConsumptionEventDto[] | FoodConsumptionForDayDto[];
}
