import { SymptomAssessmentDto } from "./symptom.assessment.dto";

//////////////////////////////////////////////////////////////////////

export interface SymptomAssessmentSearchFilters {
    Title?               : string;
    PatientUserId?       : string;
    AssessmentTemplateId?: string;
    DateFrom?            : Date;
    DateTo?              : Date;
    OrderBy              : string;
    Order                : string;
    PageIndex            : number;
    ItemsPerPage         : number;
}

export interface SymptomAssessmentSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : SymptomAssessmentDto[];
}
