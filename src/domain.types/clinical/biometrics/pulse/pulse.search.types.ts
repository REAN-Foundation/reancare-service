import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { PulseDto } from "./pulse.dto";

export interface PulseSearchFilters extends BaseSearchFilters{
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    RecordedByUserId?: uuid;
}

export interface PulseSearchResults extends BaseSearchResults{
    Items: PulseDto[];
}
