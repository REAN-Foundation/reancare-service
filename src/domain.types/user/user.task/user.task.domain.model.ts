import { UserTaskActionType } from "./user.task..types";

export interface UserTaskDomainModel {
    id?                  : string;
    UserId?              : string;
    DisplayId?           : string;
    Task?                : string;
    Category?            : string;
    Description?         : string;
    ActionType?          : UserTaskActionType;
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
