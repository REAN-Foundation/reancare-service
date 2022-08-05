import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { AssessmentTemplateDto } from "./assessment.template.dto";
import { AssessmentType } from "./assessment.types";

export interface AssessmentTemplateSearchFilters extends BaseSearchFilters{
    Title?           : string;
    Type?            : AssessmentType;
    DisplayCode?     : string;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
}

export interface AssessmentTemplateSearchResults extends BaseSearchResults{
    Items: AssessmentTemplateDto[];
}
