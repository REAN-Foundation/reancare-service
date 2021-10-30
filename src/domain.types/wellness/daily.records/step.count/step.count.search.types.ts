import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { StepCountDto } from "./step.count.dto";

export interface StepCountSearchFilters extends BaseSearchFilters{
    PatientUserId?  : uuid;
    MinValue?       : number;
    MaxValue?       : number;
    CreatedDateFrom?: Date;
    CreatedDateTo?  : Date;
}

export interface StepCountSearchResults extends BaseSearchResults{
    Items         : StepCountDto[];
}
