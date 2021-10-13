import { BodyTemperatureDto } from "./body.temperature.dto";

export interface BodyTemperatureSearchFilters {
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

export interface BodyTemperatureSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: BodyTemperatureDto[];
}
