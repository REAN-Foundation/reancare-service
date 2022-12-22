import { uuid } from "../../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { HealthPriorityDto } from "./health.priority.dto";

export interface HealthPrioritySearchFilters extends BaseSearchFilters{
    PatientUserId?       : uuid;
    ProviderEnrollmentId?: string;
    Provider?            : string;
    HealthPriorityType?  : string;
    ProviderCareplanName?: string;
    ProviderCareplanCode?: string;
}

export interface HealthPrioritySearchResults extends BaseSearchResults{
    Items: HealthPriorityDto[];
}
