export interface EnrollmentDto {
    id?          : string;
    PatientUserId: string;
    Provider?    : string;
    PlanCode?    : string;
    PlanName?    : string;
    ParticipantId: number | string;
    EnrollmentId : number | string;
    StartAt?     : Date;
    EndAt?       : Date;
    IsActive     : boolean;
    Complication?: string;
    HasHighRisk? : boolean;
}
