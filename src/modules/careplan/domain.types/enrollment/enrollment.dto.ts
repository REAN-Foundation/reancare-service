export interface EnrollmentDto {
    id?          : string;
    UserId       : string;
    Provider?    : string;
    PlanCode?    : string;
    PlanName?    : string;
    ParticipantId: number;
    EnrollmentId : number;
    StartAt?     : Date;
    EndAt?       : Date;
    IsActive     : boolean;
}
