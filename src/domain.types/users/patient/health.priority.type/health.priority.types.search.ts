import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { HealthPriorityTypeDto } from "./health.priority.type.dto";

export interface HealthPriorityTypeSearchFilters extends BaseSearchFilters {
  Type?      : string;
  Tags?      : string[];
}

export interface HealthPriorityTypeSearchResults extends BaseSearchResults {
    Items         : HealthPriorityTypeDto[];
}
