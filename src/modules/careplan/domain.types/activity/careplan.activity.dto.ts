import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface CareplanActivity {
    id?              : uuid;
    UserId           : string;
    Provider         : string;
    ParticipantIdId? : string;
    EnrollmentId?    : string;
    PlanName?        : string;
    PlanCode?        : string;
    Type?            : string;
    ProviderActionId?: string;
    Title?           : string;
    ScheduledAt?     : Date;
    CompletedAt?     : Date;
    Sequence?        : number;
    Frequency?       : number;
    Status?          : string;
}
