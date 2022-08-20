import { ProgressStatus } from "../../../domain.types/miscellaneous/system.types";
import { UserTaskDto } from "./user.task.dto";

export interface UserTaskSearchFilters {
    UserId?          : string;
    Task?            : string;
    Category?        : string;
    ActionType?      : string;
    ActionId?        : string;
    ScheduledFrom?   : Date;
    ScheduledTo?     : Date;
    Status?          : ProgressStatus;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    OrderBy?         : string;
    Order?           : string;
    PageIndex?       : number;
    ItemsPerPage?    : number;
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
