import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from "./food.consumption.dto";
import { FoodConsumptionEvents } from "./food.consumption.types";

//////////////////////////////////////////////////////////////////////

export interface FoodConsumptionSearchFilters extends BaseSearchFilters{
    PatientUserId? : uuid;
    Food?          : string;
    FoodTypes?     : string;
    Servings?      : number;
    ServingUnit?   : string;
    UserResponse?  : boolean;
    Tags?          : string[];
    ConsumedAs?    : FoodConsumptionEvents;
    DateFrom?      : Date;
    DateTo?        : Date;
}

export interface FoodConsumptionSearchResults extends BaseSearchResults{
    Items: FoodConsumptionDto[] | FoodConsumptionEventDto[] | FoodConsumptionForDayDto[];
}
