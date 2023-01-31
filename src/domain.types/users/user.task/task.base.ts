import { ProgressStatus } from "../../miscellaneous/system.types";
import { UserActionType, UserTaskCategory } from "./user.task.types";

export interface TaskBase {
    Task?                : string;
    Description?         : string;
    UserId?              : string;
    Category?            : UserTaskCategory;
    ActionType?          : UserActionType;
    Status?              : ProgressStatus;
    ScheduledStartTime?  : Date;
    ScheduledEndTime?    : Date;
    Started?             : boolean;
    StartedAt?           : Date;
    Finished?            : boolean;
    FinishedAt?          : Date;
    Cancelled?           : boolean;
    CancelledAt?         : Date;
    CancellationReason?  : string;
    IsRecurrent?         : boolean;
    RecurrenceScheduleId?: string;
}
