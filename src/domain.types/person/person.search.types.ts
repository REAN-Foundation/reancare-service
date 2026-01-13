import { BaseSearchResults } from "../miscellaneous/base.search.types";
import { PersonDto } from "./person.dto";

export interface PersonSearchFilters {
    Phone?: string;
    Email?: string;
    UniqueReferenceId?: string;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    OrderBy?: string;
    Order?: string;
    PageIndex?: number;
    ItemsPerPage?: number;
}

export interface PersonSearchResults extends BaseSearchResults {
    Items: PersonDto[];
}
