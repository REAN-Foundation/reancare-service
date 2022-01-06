import { uuid } from "../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { AssessmentDto } from "./assessment.dto";

export interface AssessmentSearchFilters extends BaseSearchFilters{
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    RecordedByUserId?: uuid;
}

export interface AssessmentSearchResults extends BaseSearchResults{
    Items: AssessmentDto[];
}
