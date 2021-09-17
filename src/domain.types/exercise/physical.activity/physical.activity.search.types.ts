//////////////////////////////////////////////////////////////////////

import { PhysicalActivityDto, PhysicalActivityForDayDto } from "./physical.activity.dto";

export interface PhysicalActivitySearchFilters {
    PatientUserId?: string;
    Exercise?: string;
    Category?: string;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface PhysicalActivitySearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: PhysicalActivityDto[] | PhysicalActivityForDayDto[];
}
