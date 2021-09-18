import { DrugDto } from "./drug.dto";

//////////////////////////////////////////////////////////////////////

export interface DrugSearchFilters {
    Name?: string;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface DrugSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DrugDto[];
}
