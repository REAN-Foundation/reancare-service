import { UserActionDomainModel } from "./user.action.domain.model";
import { UserTaskCategoryDomainModel } from "./user.task.category.domain.model";

export interface UserTaskDomainModel {
    id?                  : string;
    DisplayId?           : string;
    UserId?              : string;
    UserRole?            : string;
    TaskName?            : string;
    Category?            : UserTaskCategoryDomainModel;
    Action?              : UserActionDomainModel;
    ScheduledStartTime?  : Date;
    ScheduledEndTime?    : Date;
    Started?             : boolean;
    StartedAt?           : Date;
    Finished             : boolean;
    FinishedAt?          : Date;
    TaskIsSuccess?       : boolean;
    Cancelled?           : boolean;
    CancelledAt?         : Date;
    CancellationReason?  : string;
    IsRecurrent?         : boolean;
    RecurrenceScheduleId?: string;
}
