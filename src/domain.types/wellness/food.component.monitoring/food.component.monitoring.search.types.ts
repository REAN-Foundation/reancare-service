import { BaseSearchResults, BaseSearchFilters } from "../../miscellaneous/base.search.types";
import { uuid } from "../../miscellaneous/system.types";
import { FoodComponentMonitoringDto } from "./food.component.monitoring.dto";
import { FoodComponentMonitoringTypes } from "./food.component.monitoring.types";

export interface FoodComponentMonitoringSearchFilters extends BaseSearchFilters{
    PatientUserId?         : uuid;
    MonitoredFoodComponent?: FoodComponentMonitoringTypes;
    AmountFrom?            : number;
    AmountTo?              : number
}

export interface FoodComponentMonitoringSearchResults extends BaseSearchResults {
    Items: FoodComponentMonitoringDto[]
}
