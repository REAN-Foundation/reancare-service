import { SleepDto } from "./sleep.dto";

export interface SleepSearchFilters {
    PersonId?       : string;
    PatientUserId?  : string;
    MinValue?       : number;
    MaxValue?       : number;
    CreatedDateFrom?: Date;
    CreatedDateTo?  : Date;
    OrderBy         : string;
    Order           : string;
    PageIndex       : number;
    ItemsPerPage    : number;
}

export interface SleepSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : SleepDto[];
}
