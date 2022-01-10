import { UserTaskCategory } from "../../../../domain.types/user/user.task/user.task.types";
import { uuid } from "../../../miscellaneous/system.types";

export interface CareplanActivityDto {
    id?              : uuid;
    PatientUserId    : string;
    Provider         : string;
    ParticipantIdId? : string;
    EnrollmentId?    : string;
    PlanName?        : string;
    PlanCode?        : string;
    Type?            : string;
    Category?        : UserTaskCategory;
    ProviderActionId?: string;
    Title?           : string;
    ScheduledAt?     : Date;
    StartedAt?       : Date;
    CompletedAt?     : Date;
    Comments?        : string;
    Sequence?        : number;
    Frequency?       : number;
    Status?          : string;
}
