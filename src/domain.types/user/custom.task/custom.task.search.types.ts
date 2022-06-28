import { ProgressStatus } from "../../miscellaneous/system.types";
import { UserTaskCategory } from "../user.task/user.task.types";
import { CustomTaskDto } from "./custom.task.dto";

export interface CustomTaskSearchFilters {
    UserId?         : string;
    Task?           : string;
    Category?       : UserTaskCategory;
    ActionType      : string;
    ActionId?       : string;
    ScheduledFrom?  : Date;
    ScheduledTo?    : Date;
    Status?         : ProgressStatus;
    CreatedDateFrom?: Date;
    CreatedDateTo?  : Date;
    OrderBy?        : string;
    Order?          : string;
    PageIndex?      : number;
    ItemsPerPage?   : number;
}

export interface CustomTaskSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : CustomTaskDto[];
}
