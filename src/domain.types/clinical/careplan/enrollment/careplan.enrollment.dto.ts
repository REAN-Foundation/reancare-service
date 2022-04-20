export interface CarePlanEnrollmentDto {
    id?          : string;
    EhrId?       : string;
    PatientUserId: string;
    Provider?    : string;
    PlanCode?    : string;
    PlanName?    : string;
    ParticipantId: number;
    EnrollmentId : number;
    StartAt?     : Date;
    EndAt?       : Date;
    IsActive     : boolean;
}
