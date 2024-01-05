import { UserTaskCategory } from "../../../../domain.types/users/user.task/user.task.types";
import { uuid } from "../../../miscellaneous/system.types";

export interface CareplanActivityDto {
    id?               : uuid;
    PatientUserId     : uuid;
    Provider          : string;
    ParticipantId?    : number | string;
    EnrollmentId?     : number | string;
    UserTaskId?       : uuid;
    PlanName?         : string;
    PlanCode?         : string;
    Type?             : string;
    Category?         : UserTaskCategory;
    ProviderActionId? : string;
    Title?            : string;
    Description?      : string;
    Transcription?    : string;
    Url?              : string;
    ScheduledAt?      : Date;
    StartedAt?        : Date;
    CompletedAt?      : Date;
    UserResponse?     : string;
    Items?            : string[];
    Sequence?         : number;
    Frequency?        : number;
    Status?           : string;
    RawContent?       : string;
    CreatedAt?        : Date;
    UpdatedAt?        : Date;
}
