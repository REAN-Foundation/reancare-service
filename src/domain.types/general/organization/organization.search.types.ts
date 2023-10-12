import { BaseSearchFilters } from "../../../domain.types/miscellaneous/base.search.types";
import { OrganizationDto } from "./organization.dto";
import { BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";

//////////////////////////////////////////////////////////////////////

export interface OrganizationSearchFilters extends BaseSearchFilters {
    Type?: string;
    Name?: string;
    ContactUserId?: string;
    ContactPhone?: string;
    ContactEmail?: string;
    OperationalSinceFrom: Date;
    OperationalSinceTo: Date;
    CreatedDateFrom: Date;
    CreatedDateTo: Date;
}

export interface OrganizationSearchResults extends BaseSearchResults {
    Items: OrganizationDto[];
}
