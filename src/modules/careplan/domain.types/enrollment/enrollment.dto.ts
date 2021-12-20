export interface EnrollmentDto {
    id?          : string;
    UserId       : string;
    Provider     : string;
    PlanCode?    : string;
    PlanName     : string;
    ParticipantId: number;
    IsActive     : boolean;
    EnrollmentId : number;
    StartAt?     : Date;
    EndAt?       : Date;
   
}
