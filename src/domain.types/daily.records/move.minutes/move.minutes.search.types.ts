import { MoveMinutesDto } from "./move.minutes.dto";

export interface MoveMinutesSearchFilters {
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

export interface MoveMinutesSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : MoveMinutesDto[];
}
