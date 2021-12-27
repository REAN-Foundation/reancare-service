import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface CareplanActivity {
    PatientUserId?   : uuid;
    Provider         : string;
    ParticipantId?   : string;
    EnrollmentId?    : string;
    PlanName?        : string;
    PlanCode?        : string;
    Type?            : string;
    ProviderActionId : string;
    Title?           : string;
    ScheduledAt?     : Date;
    Sequence?        : number;
    Frequency?       : number;
    Status?          : string;
}
