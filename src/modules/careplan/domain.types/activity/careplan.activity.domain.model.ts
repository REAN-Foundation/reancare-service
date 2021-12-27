import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface CareplanActivityDomainModel {
    PatientUserId   : uuid;
    EnrollmentId    : string;
    ParticipantId   : string;
    Provider        : string;
    PlanName        : string;
    PlanCode        : string;
    Type            : string;
    ProviderActionId: string;
    Title           : string;
    ScheduledAt     : Date;
    Sequence        : number;
    Frequency       : number;
    Status          : string;
}
