import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BodyWeightDto } from "./body.weight.dto";

export interface BodyWeightSearchFilters extends BaseSearchFilters {
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    RecordedByUserId?: uuid;
}

export interface BodyWeightSearchResults extends BaseSearchResults {
    Items: BodyWeightDto[];
}
