import { UserActionType, UserTaskCategory } from "./user.task.types";

export interface UserTaskDomainModel {
    id?                  : string;
    UserId?              : string;
    DisplayId?           : string;
    Task?                : string;
    Category?            : UserTaskCategory;
    Description?         : string;
    ActionType?          : UserActionType;
    ActionId?            : string;
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
