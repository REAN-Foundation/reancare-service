import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { CalorieBalanceDto } from "./calorie.balance.dto";

export interface CalorieBalanceSearchFilters extends BaseSearchFilters {
    PatientUserId?           : uuid;
    MinCaloriesConsumedValue?: number;
    MaxCaloriesConsumedValue?: number;
    MinCaloriesBurnedValue?  : number;
    MaxCaloriesBurnedValue?  : number;
    MinCalorieBalanceValue?  : number;
    MaxCalorieBalanceValue?  : number;
    CreatedDateFrom?         : Date;
    CreatedDateTo?           : Date;
}

export interface CalorieBalanceSearchResults extends BaseSearchResults{
    Items: CalorieBalanceDto[];
}
