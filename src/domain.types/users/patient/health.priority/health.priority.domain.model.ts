import { HealthPriorityType } from "../health.priority.type/health.priority.types";

export interface HealthPriorityDomainModel {
    id?                  : string;
    PatientUserId        : string;
    Source?              : string;
    Provider?            : string;
    ProviderEnrollmentId : string;
    ProviderCareplanCode?: string;
    ProviderCareplanName?: string;
    HealthPriorityType?  : HealthPriorityType;
    StartedAt?           : Date;
    ScheduledEndDate?    : Date;
    CompletedAt?         : Date;
    Status?              : string;
    IsPrimary?           : boolean;
}
