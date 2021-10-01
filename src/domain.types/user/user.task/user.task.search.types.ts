import { UserTaskDto } from "./user.task.dto";

export interface UserTaskSearchFilters {
    UserId?                : string;
    UserRole?              : string;
    Name?                  : string;
    CategoryId?            : number;
    ActionType             : string;
    ReferenceItemId?       : string;
    ScheduledStartTimeFrom?: Date;
    ScheduledStartTimeTo?  : Date;
    ScheduledEndTimeFrom?  : Date;
    ScheduledEndTimeTo?    : Date;
    Started?               : boolean;
    Finished               : boolean;
    Cancelled?             : boolean;
    CreatedDateFrom?       : Date;
    CreatedDateTo?         : Date;
    OrderBy                : string;
    Order                  : string;
    PageIndex              : number;
    ItemsPerPage           : number;
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
