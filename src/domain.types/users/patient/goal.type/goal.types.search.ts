import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { GoalTypeDto } from "./goal.type.dto";

export interface GoalTypeSearchFilters extends BaseSearchFilters {
  Type?      : string;
  Tags?      : string[];
}

export interface GoalTypeSearchResults extends BaseSearchResults {
    Items         : GoalTypeDto[];
}
