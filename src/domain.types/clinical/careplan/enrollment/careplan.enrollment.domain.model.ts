export interface CarePlanEnrollmentDomainModel {
    id?           : string;
    Name?         : string;
    EhrId?        : string;
    PatientUserId : string;
    Provider?     : string;
    PlanCode?     : string;
    PlanName?     : string;
    ParticipantId?: string;
    EnrollmentId? : string;
    StartDateStr? : string;
    EndDateStr?   : string;
    StartDate?    : Date;
    EndDate?      : Date;
    Gender?       : string;
    BirthDate?    : Date;
}
