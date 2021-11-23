import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { MoveMinutesDto } from "./move.minutes.dto";

export interface MoveMinutesSearchFilters extends BaseSearchFilters {
    PatientUserId?  : uuid;
    MinValue?       : number;
    MaxValue?       : number;
    CreatedDateFrom?: Date;
    CreatedDateTo?  : Date;
}

export interface MoveMinutesSearchResults extends BaseSearchResults {
    Items         : MoveMinutesDto[];
}
