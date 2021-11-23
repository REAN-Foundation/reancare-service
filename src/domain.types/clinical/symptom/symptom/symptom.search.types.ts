import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { SymptomDto } from "./symptom.dto";

//////////////////////////////////////////////////////////////////////

export interface SymptomSearchFilters extends BaseSearchFilters{
    Symptom?             : string;
    SymptomTypeId?       : uuid;
    PatientUserId?       : uuid;
    AssessmentId?        : uuid;
    AssessmentTemplateId?: uuid;
    VisitId?             : uuid;
    DateFrom?            : Date;
    DateTo?              : Date;
}

export interface SymptomSearchResults extends BaseSearchResults{
    Items         : SymptomDto[];
}
