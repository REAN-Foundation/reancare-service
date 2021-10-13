
import { UserDto } from "../user/user.dto";
import { UserActionDto } from "./user.action.dto";
import { UserTaskCategoryDto } from "./user.task.category.dto";

export interface UserTaskDto {
    id?                  : string;
    DisplayId?           : string;
    User?                : UserDto;
    TaskName?            : string;
    Category?            : UserTaskCategoryDto;
    Action?              : UserActionDto;
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
