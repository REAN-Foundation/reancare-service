import { uuid } from "../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { AssessmentDto } from "./assessment.dto";
import { AssessmentType } from "./assessment.types";

export interface AssessmentSearchFilters extends BaseSearchFilters {
    PatientUserId?       : uuid;
    AssessmentTemplateId?: uuid;
    Title?               : string;
    Type?                : AssessmentType;
    CreatedDateFrom?     : Date;
    CreatedDateTo?       : Date;
}

export interface AssessmentSearchResults extends BaseSearchResults{
    Items: AssessmentDto[];
}
