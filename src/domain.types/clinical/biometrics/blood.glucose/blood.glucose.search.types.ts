import { BloodGlucoseDto } from "./blood.glucose.dto";

export interface BloodGlucoseSearchFilters {
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

export interface BloodGlucoseSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: BloodGlucoseDto[];
}
