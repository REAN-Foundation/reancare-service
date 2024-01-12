
import { integer } from "./system.types";

//////////////////////////////////////////////////////////////////////

export interface BaseSearchFilters {
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    OrderBy?         : string;
    Order?           : string;
    PageIndex?       : integer;
    ItemsPerPage?    : integer;
}

export interface BaseSearchResults {
    TotalCount    : integer;
    RetrievedCount: integer;
    PageIndex?     : integer;
    ItemsPerPage?  : integer;
    Order?         : string;
    OrderedBy?    : string;
}
