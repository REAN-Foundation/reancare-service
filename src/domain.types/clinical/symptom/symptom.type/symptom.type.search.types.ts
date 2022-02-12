import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { SymptomTypeDto } from "./symptom.type.dto";

//////////////////////////////////////////////////////////////////////

export interface SymptomTypeSearchFilters extends BaseSearchFilters{
    Symptom?: string;
    Tag?    : string;
}

export interface SymptomTypeSearchResults extends BaseSearchResults{
    Items         : SymptomTypeDto[];
}
