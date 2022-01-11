import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface CareplanActivityDto {
    id?              : uuid;
    PatientUserId    : string;
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
    Comments?        : string;
    Items?           : string[];
    Sequence?        : number;
    Frequency?       : number;
    Status?          : string;
}
