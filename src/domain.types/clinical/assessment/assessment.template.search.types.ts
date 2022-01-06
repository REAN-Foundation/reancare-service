import { uuid } from "../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { AssessmentTemplateDto } from "./assessment.template.dto";

export interface AssessmentTemplateSearchFilters extends BaseSearchFilters{
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    RecordedByUserId?: uuid;
}

export interface AssessmentTemplateSearchResults extends BaseSearchResults{
    Items: AssessmentTemplateDto[];
}
