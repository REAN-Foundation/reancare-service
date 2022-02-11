import { uuid } from "../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { HealthPriorityDto } from "./health.priority.dto";

export interface HealthPrioritySearchFilters extends BaseSearchFilters{
    PatientUserId?   : uuid;
    EnrollmentId?: string;
    Provider?    : string;
    PlanCode?    : string;
    PlanName?    : string;
}

export interface HealthPrioritySearchResults extends BaseSearchResults{
    Items: HealthPriorityDto[];
}
