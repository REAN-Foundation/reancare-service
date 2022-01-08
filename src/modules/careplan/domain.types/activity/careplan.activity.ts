import { UserTaskCategory } from "../../../../domain.types/user/user.task/user.task.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface CareplanActivity {
    id?             : uuid;
    PatientUserId?  : uuid;
    ProviderActionId: string;
    EnrollmentId?   : string;
    Provider        : string;
    ParticipantId?  : string;
    PlanName?       : string;
    PlanCode?       : string;
    Type?           : string;
    Category?       : UserTaskCategory;
    Title?          : string;
    Description?    : string;
    Url?            : string;
    Language?       : string;
    ScheduledAt?    : Date;
    CompletedAt?    : Date;
    Sequence?       : number;
    Frequency?      : number;
    Status?         : string;
    Comments?       : string;
    RawContent?     : string;
}
