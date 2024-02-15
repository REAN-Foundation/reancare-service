import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { HealthSystemDto } from "./health.system.dto";

export interface HealthSystemSearchFilters extends BaseSearchFilters {
    Name?          : string;
    Tags?          : string[];
}

export interface HealthSystemSearchResults extends BaseSearchResults {
    Items : HealthSystemDto[];
}
