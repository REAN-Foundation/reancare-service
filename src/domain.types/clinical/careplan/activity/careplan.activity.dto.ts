import { UserTaskCategory } from "../../../../domain.types/user/user.task/user.task.types";
import { uuid } from "../../../miscellaneous/system.types";

export interface CareplanActivityDto {
    id?              : uuid;
    PatientUserId    : uuid;
    Provider         : string;
    ParticipantIdId? : string;
    EnrollmentId?    : string;
    UserTaskId?      : uuid;
    PlanName?        : string;
    PlanCode?        : string;
    Type?            : string;
    Category?        : UserTaskCategory;
    ProviderActionId?: string;
    Title?           : string;
    Description?     : string;
    Url?             : string;
    ScheduledAt?     : Date;
    StartedAt?       : Date;
    CompletedAt?     : Date;
    Comments?        : string;
    Sequence?        : number;
    Frequency?       : number;
    Status?          : string;
    RawContent?      : string;
}
