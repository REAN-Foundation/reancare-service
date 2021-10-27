import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { BloodGlucoseDto } from "./blood.glucose.dto";

export interface BloodGlucoseSearchFilters extends BaseSearchFilters{
    PatientUserId?   : string;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    RecordedByUserId?: string;
}

export interface BloodGlucoseSearchResults extends BaseSearchResults{
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: BloodGlucoseDto[];
}
