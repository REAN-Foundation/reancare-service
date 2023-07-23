import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { TenantDto } from "./tenant.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface TenantSearchFilters extends BaseSearchFilters {
    Name   : string;
    Code  ?: string;
    Phone? : string;
    Email? : string;
}

export interface TenantSearchResults extends BaseSearchResults {
    Items : TenantDto[];
}
