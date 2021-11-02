import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { BloodGlucoseDto } from "./blood.glucose.dto";

export interface BloodGlucoseSearchFilters extends BaseSearchFilters{
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    RecordedByUserId?: uuid;
}

export interface BloodGlucoseSearchResults extends BaseSearchResults{
    Items: BloodGlucoseDto[];
}
