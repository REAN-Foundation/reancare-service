import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { SleepDto } from "./sleep.dto";

export interface SleepSearchFilters extends BaseSearchFilters{
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    StartTime?       : Date;
    EndTime?         : Date;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
}

export interface SleepSearchResults extends BaseSearchResults {
    Items         : SleepDto[];
}
