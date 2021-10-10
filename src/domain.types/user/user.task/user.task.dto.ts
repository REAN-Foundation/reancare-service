import { ProgressStatus } from "../../../domain.types/miscellaneous/system.types";
import { UserTaskCategory } from "./user.task..types";

export interface UserTaskDto {
    id?                  : string;
    UserId?              : string;
    DisplayId?           : string;
    Task?                : string;
    Category?            : UserTaskCategory;
    Action?              : string;
    Description?         : string;
    ReferenceItemId?     : string;
    ScheduledStartTime?  : Date;
    ScheduledEndTime?    : Date;
    Status?              : ProgressStatus;
    Started?             : boolean;
    StartedAt?           : Date;
    Finished             : boolean;
    FinishedAt?          : Date;
    Cancelled?           : boolean;
    CancelledAt?         : Date;
    CancellationReason?  : string;
    IsRecurrent?         : boolean;
    RecurrenceScheduleId?: string;
}

export interface TaskSummaryDto {
    TotalCount     : number;
    CompletedCount : number;
    InProgressCount: number;
    PendingCount   : number;
    CompletedTasks : UserTaskDto[];
    InProgressTasks: UserTaskDto[];
    PendingTasks   : UserTaskDto[];
}
