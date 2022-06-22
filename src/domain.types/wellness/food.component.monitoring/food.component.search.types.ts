import { BaseSearchResults, BaseSearchFilters } from "../../miscellaneous/base.search.types";
import { uuid } from "../../miscellaneous/system.types";
import { FoodComponentDto } from "./food.component.dto";

export interface FoodComponentSearchFilters extends BaseSearchFilters{
    PatientUserId?: uuid;
    TypeOfFood?   : string;
    AmountFrom?   : number;
    AmountTo?     : number
}

export interface FoodComponentSearchResults extends BaseSearchResults {
    Items: FoodComponentDto[]
}
