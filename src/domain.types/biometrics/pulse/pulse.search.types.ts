import { PulseDto } from "./pulse.dto";

export interface PulseSearchFilters {
    PersonId?: string;
    PatientUserId?: string;
    MinValue?: number;
    MaxValue?: number;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    RecordedByUserId?: string;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface PulseSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: PulseDto[];
}
