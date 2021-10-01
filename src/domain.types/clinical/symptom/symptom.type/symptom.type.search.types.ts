import { SymptomTypeDto } from "./symptom.type.dto";

//////////////////////////////////////////////////////////////////////

export interface SymptomTypeSearchFilters {
    Symptom?     : string;
    Tag?         : string;
    OrderBy?     : string;
    Order?       : string;
    PageIndex?   : number;
    ItemsPerPage?: number;
}

export interface SymptomTypeSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : SymptomTypeDto[];
}
