export interface HealthPriority {
    PatientUserId?: string;
    EnrollmentId? : string;
    Provider?    : string;
    PlanCode?    : string;
    PlanName?    : string;
    ActivityCode?: string;
    PriorityId?  : string;
    PriorityName?: string;
    PriorityCode?: string;
    Selected?    : boolean;
    StartedAt?   : Date;
    CompletedAt? : Date;
    Status?      : string;
}
