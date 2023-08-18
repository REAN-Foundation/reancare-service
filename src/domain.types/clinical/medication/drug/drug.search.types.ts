import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { DrugDto } from "./drug.dto";

//////////////////////////////////////////////////////////////////////

export interface DrugSearchFilters extends BaseSearchFilters {
    Name?: string;
    GenericName?: string;
}

export interface DrugSearchResults extends BaseSearchResults {
    Items: DrugDto[];
}
