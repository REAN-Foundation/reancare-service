import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { HealthSystemDto } from "./health.system.dto";

export interface HealthSystemSearchFilters extends BaseSearchFilters {
    Name?          : string;
    Tags?          : string[];
    TenantId?      : uuid
}

export interface HealthSystemSearchResults extends BaseSearchResults {
    Items : HealthSystemDto[];
}
