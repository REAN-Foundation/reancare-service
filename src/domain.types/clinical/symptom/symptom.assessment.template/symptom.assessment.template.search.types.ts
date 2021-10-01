import { SymptomAssessmentTemplateDto } from "./symptom.assessment.template.dto";

//////////////////////////////////////////////////////////////////////

export interface SymptomAssessmentTemplateSearchFilters {
    Title?        : string;
    Tag ?         : string;
    SymptomName?  : string;
    SymptomTypeId?: string;
    OrderBy       : string;
    Order         : string;
    PageIndex     : number;
    ItemsPerPage  : number;
}

export interface SymptomAssessmentTemplateSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : SymptomAssessmentTemplateDto[];
}
