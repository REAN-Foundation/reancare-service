import { UserTaskDto } from "./user.task.dto";

export interface UserTaskSearchFilters {
    UserId?         : string;
    Task?           : string;
    Category?       : number;
    Action          : string;
    ReferenceItemId?: string;
    ScheduledFrom?  : Date;
    ScheduledTo?    : Date;
    Started?        : boolean;
    Finished        : boolean;
    Cancelled?      : boolean;
    CreatedDateFrom?: Date;
    CreatedDateTo?  : Date;
    OrderBy         : string;
    Order           : string;
    PageIndex       : number;
    ItemsPerPage    : number;
}

export interface UserTaskSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: UserTaskDto[];
}
