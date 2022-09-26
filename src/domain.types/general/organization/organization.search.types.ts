import { OrganizationDto } from "./organization.dto";

//////////////////////////////////////////////////////////////////////

export interface OrganizationSearchFilters {
    Type?: string;
    Name?: string;
    ContactUserId?: string;
    ContactPhone?: string;
    ContactEmail?: string;
    OperationalSinceFrom: Date;
    OperationalSinceTo: Date;
    CreatedDateFrom: Date;
    CreatedDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface OrganizationSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: OrganizationDto[];
}
