import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { SymptomAssessmentTemplateDto } from "./symptom.assessment.template.dto";

//////////////////////////////////////////////////////////////////////

export interface SymptomAssessmentTemplateSearchFilters extends BaseSearchFilters{
    Title?        : string;
    Tag ?        : string;
    SymptomName?  : string;
    SymptomTypeId?: uuid;
}

export interface SymptomAssessmentTemplateSearchResults extends BaseSearchResults{
    Items         : SymptomAssessmentTemplateDto[];
}
