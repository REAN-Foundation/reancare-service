import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { uuid } from "../../../miscellaneous/system.types";
import { StandDto } from "./stand.dto";

export interface StandSearchFilters extends BaseSearchFilters{
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
}

export interface StandSearchResults extends BaseSearchResults{
    Items         : StandDto[];
}
