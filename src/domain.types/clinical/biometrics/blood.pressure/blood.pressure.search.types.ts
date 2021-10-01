import { BloodPressureDto } from "./blood.pressure.dto";

export interface BloodPressureSearchFilters {
    PersonId?: string;
    PatientUserId?: string;
    MinSystolicValue?: number;
    MaxSystolicValue?: number;
    MinDiastolicValue?: number;
    MaxDiastolicValue?: number;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    RecordedByUserId?: string;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface BloodPressureSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: BloodPressureDto[];
}
