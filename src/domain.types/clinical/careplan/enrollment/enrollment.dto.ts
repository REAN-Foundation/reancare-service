export interface EnrollmentDto {
    id?          : string;
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
