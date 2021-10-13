import { SymptomDto } from "./symptom.dto";

//////////////////////////////////////////////////////////////////////

export interface SymptomSearchFilters {
    Symptom?             : string;
    SymptomTypeId?       : string;
    PatientUserId?       : string;
    AssessmentId?        : string;
    AssessmentTemplateId?: string;
    VisitId?             : string;
    DateFrom?            : Date;
    DateTo?              : Date;
    OrderBy              : string;
    Order                : string;
    PageIndex            : number;
    ItemsPerPage         : number;
}

export interface SymptomSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : SymptomDto[];
}
