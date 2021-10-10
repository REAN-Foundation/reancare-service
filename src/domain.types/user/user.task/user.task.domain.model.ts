
export interface UserTaskDomainModel {
    id?                  : string;
    UserId?              : string;
    DisplayId?           : string;
    Task?                : string;
    Category?            : string;
    Action?              : string;
    Description?         : string;
    ReferenceItemId?     : string;
    ScheduledStartTime?  : Date;
    ScheduledEndTime?    : Date;
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
