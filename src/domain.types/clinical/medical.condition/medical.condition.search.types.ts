import { MedicalConditionDto } from "./medical.condition.dto";
import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";

//////////////////////////////////////////////////////////////////////

export interface MedicalConditionSearchFilters extends BaseSearchFilters{
    Condition?  : string;
}

export interface MedicalConditionSearchResults extends BaseSearchResults{
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : MedicalConditionDto[];
}
