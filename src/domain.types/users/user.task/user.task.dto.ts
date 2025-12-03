import { BotMessagingType } from "../,./../../../domain.types/miscellaneous/bot,request.types";
import { ProgressStatus } from "../../../domain.types/miscellaneous/system.types";
import { UserActionType, UserTaskCategory } from "./user.task.types";

export interface UserTaskDto {
    id?                   : string;
    UserId?               : string;
    DisplayId?            : string;
    Task?                 : string;
    Category?             : UserTaskCategory;
    Description?          : string;
    Transcription?        : string;
    ActionType?           : UserActionType;
    ActionId?             : string;
    ParentActionId?       : string;
    Action?               : any;
    ScheduledStartTime?   : Date;
    ScheduledEndTime?     : Date;
    Status?               : ProgressStatus;
    Channel?              : string;
    TenantName?           : string;
    Started?              : boolean;
    StartedAt?            : Date;
    Finished              : boolean;
    FinishedAt?           : Date;
    Cancelled?            : boolean;
    CancelledAt?          : Date;
    CancellationReason?   : string;
    IsRecurrent?          : boolean;
    RecurrenceScheduleId? : string;
    CreatedAt?            : Date;
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

export interface UserTaskMessageDto extends UserTaskDto {
    Language?: string;
    Sequence?: number;
    Metadata?: Record<string, any>;
}

export interface ProcessedTaskDto {
    MessageType: BotMessagingType;
    Message: string;
    Metadata?: Record<string, any>;
}
