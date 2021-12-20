import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface CareplanArtifactDto {
    id              : uuid;
    UserId          : string;
    EnrollmentId    : number;
    CareplanProvider: string;
    CareplanName    : string;
    Type            : string;
    ProviderActionId: string;
    Title           : string;
    ScheduledAt     : Date;
    Sequence        : number;
    Frequency       : number;
    Status          : string;
}
