import { BloodOxygenSaturationDto } from "./blood.oxygen.saturation.dto";

export interface BloodOxygenSaturationSearchFilters {
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

export interface BloodOxygenSaturationSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: BloodOxygenSaturationDto[];
}
