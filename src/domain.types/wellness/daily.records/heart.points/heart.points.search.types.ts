import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { HeartPointsDto } from "./heart.points.dto";

export interface HeartPointsSearchFilters extends BaseSearchFilters{
    PatientUserId?  : uuid;
    MinValue?       : number;
    MaxValue?       : number;
    CreatedDateFrom?: Date;
    CreatedDateTo?  : Date;
}

export interface HeartPointsSearchResults extends BaseSearchResults {
    Items         : HeartPointsDto[];
}
