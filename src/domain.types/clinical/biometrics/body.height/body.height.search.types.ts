import { BodyHeightDto } from "./body.height.dto";

export interface BodyHeightSearchFilters {
    PatientUserId?: string;
    MinValue?: number;
    MaxValue?: number;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    RecordedByUserId?: string;
    OrderBy?: string;
    Order?: string;
    PageIndex?: number;
    ItemsPerPage?: number;
}

export interface BodyHeightSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order?: string;
    OrderedBy?: string;
    Items: BodyHeightDto[];
}
