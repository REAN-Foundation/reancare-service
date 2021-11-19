import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { SymptomAssessmentDto } from "./symptom.assessment.dto";

//////////////////////////////////////////////////////////////////////

export interface SymptomAssessmentSearchFilters extends BaseSearchFilters{
    Title?               : string;
    PatientUserId?       : uuid;
    AssessmentTemplateId?: uuid;
    DateFrom?            : Date;
    DateTo?              : Date;
}

export interface SymptomAssessmentSearchResults extends BaseSearchResults{
    Items         : SymptomAssessmentDto[];
}
