export interface EnrollmentDomainModel {
    id?           : string;
    UserId        : string;
    Provider      : string;
    EnrollmentId? : number;
    ParticipantId?: number;
    PlanName      : string;
    PlanCode?     : string;
    StartDate?    : Date;
    EndDate?      : Date;
    Gender        : string;
}
